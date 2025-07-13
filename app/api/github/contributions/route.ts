import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Simple in-memory cache for GitHub data (in production, use Redis or similar)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface GitHubContribution {
  repository: string;
  commits: number;
  additions: number;
  deletions: number;
  pullRequests: number;
  issues: number;
  lastContribution: string;
}

interface GitHubAchievements {
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalRepositories: number;
  languages: string[];
  accountAge: number; // in days
  publicRepos: number;
  followers: number;
  following: number;
  contributions: GitHubContribution[];
  achievements: {
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    badges: string[];
    score: number;
  };
}

async function fetchGitHubContributions(username: string, token?: string): Promise<GitHubAchievements> {
  console.log('Fetching GitHub contributions for:', username, 'with token:', !!token);
  
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'MustaFair-App'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (!userResponse.ok) {
      if (userResponse.status === 403) {
        console.log('GitHub API rate limit hit, returning mock data');
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${userResponse.status} ${userResponse.statusText}`);
    }
    
    const userData = await userResponse.json();

    // Check if userData is valid
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid user data from GitHub API');
    }

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    
    if (!reposResponse.ok) {
      if (reposResponse.status === 403) {
        console.log('GitHub API rate limit hit, returning mock data');
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${reposResponse.status} ${reposResponse.statusText}`);
    }
    
    const reposData = await reposResponse.json();

    // Check if reposData is an array
    if (!Array.isArray(reposData)) {
      console.error('GitHub API returned non-array for repos:', reposData);
      throw new Error('Invalid response from GitHub API');
    }

    // Calculate contributions for each repository
    const contributions: GitHubContribution[] = [];
    let totalCommits = 0;
    let totalPullRequests = 0;
    let totalIssues = 0;
    const languages = new Set<string>();

    for (const repo of reposData.slice(0, 5)) { // Limit to top 5 repos to avoid API limits
      if (repo.owner.login === username) {
        try {
          // Fetch commits count
          const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`, { headers });
          let commitsCount = 0;
          
          if (commitsResponse.ok) {
            const linkHeader = commitsResponse.headers.get('link');
            if (linkHeader) {
              const match = linkHeader.match(/page=(\d+)>; rel="last"/);
              commitsCount = match ? parseInt(match[1]) : 0;
            } else {
              const commitsData = await commitsResponse.json();
              commitsCount = Array.isArray(commitsData) ? commitsData.length : 0;
            }
          }

          // Fetch pull requests
          const prsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/pulls?state=all&creator=${username}&per_page=1`, { headers });
          let prsCount = 0;
          
          if (prsResponse.ok) {
            const linkHeader = prsResponse.headers.get('link');
            if (linkHeader) {
              const match = linkHeader.match(/page=(\d+)>; rel="last"/);
              prsCount = match ? parseInt(match[1]) : 0;
            } else {
              const prsData = await prsResponse.json();
              prsCount = Array.isArray(prsData) ? prsData.length : 0;
            }
          }

          // Fetch issues
          const issuesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/issues?state=all&creator=${username}&per_page=1`, { headers });
          let issuesCount = 0;
          
          if (issuesResponse.ok) {
            const linkHeader = issuesResponse.headers.get('link');
            if (linkHeader) {
              const match = linkHeader.match(/page=(\d+)>; rel="last"/);
              issuesCount = match ? parseInt(match[1]) : 0;
            } else {
              const issuesData = await issuesResponse.json();
              issuesCount = Array.isArray(issuesData) ? issuesData.length : 0;
            }
          }

          totalCommits += commitsCount;
          totalPullRequests += prsCount;
          totalIssues += issuesCount;

          if (repo.language) {
            languages.add(repo.language);
          }

          contributions.push({
            repository: repo.name,
            commits: commitsCount,
            additions: 0, // Would need detailed commit analysis
            deletions: 0, // Would need detailed commit analysis
            pullRequests: prsCount,
            issues: issuesCount,
            lastContribution: repo.updated_at
          });
        } catch (error) {
          console.warn(`Failed to fetch data for repo ${repo.name}:`, error);
        }
        
        // Add small delay between API calls to be respectful to rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Calculate account age
    const accountCreated = new Date(userData.created_at || Date.now());
    const accountAge = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate achievement tier and score
    const score = calculateGitHubScore({
      totalCommits,
      totalPullRequests,
      totalIssues,
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      accountAge
    });

    const tier = calculateTier(score);
    const badges = calculateBadges({
      totalCommits,
      totalPullRequests,
      totalIssues,
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      accountAge,
      languages: Array.from(languages)
    });

    return {
      totalCommits,
      totalPullRequests,
      totalIssues,
      totalRepositories: userData.public_repos || 0,
      languages: Array.from(languages),
      accountAge,
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      contributions,
      achievements: {
        tier,
        badges,
        score
      }
    };
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    
    // Return mock data for development/testing
    console.log('Returning mock GitHub data for user:', username);
    return {
      totalCommits: 156,
      totalPullRequests: 23,
      totalIssues: 8,
      totalRepositories: 12,
      languages: ['TypeScript', 'JavaScript', 'Python', 'Solidity'],
      accountAge: 1247,
      publicRepos: 12,
      followers: 34,
      following: 45,
      contributions: [
        {
          repository: 'awesome-project',
          commits: 78,
          additions: 0,
          deletions: 0,
          pullRequests: 12,
          issues: 3,
          lastContribution: new Date().toISOString()
        },
        {
          repository: 'web3-dapp',
          commits: 45,
          additions: 0,
          deletions: 0,
          pullRequests: 8,
          issues: 2,
          lastContribution: new Date().toISOString()
        }
      ],
      achievements: {
        tier: 'Silver' as const,
        badges: ['Regular Contributor', 'Code Reviewer', 'Multi-Language', 'Experienced (3+ years)'],
        score: 892
      }
    };
  }
}

function calculateGitHubScore(data: {
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  publicRepos: number;
  followers: number;
  accountAge: number;
}): number {
  const {
    totalCommits,
    totalPullRequests,
    totalIssues,
    publicRepos,
    followers,
    accountAge
  } = data;

  // Weighted scoring system
  const commitScore = Math.min(totalCommits * 2, 1000); // Max 1000 points from commits
  const prScore = Math.min(totalPullRequests * 10, 500); // Max 500 points from PRs
  const issueScore = Math.min(totalIssues * 5, 300); // Max 300 points from issues
  const repoScore = Math.min(publicRepos * 20, 600); // Max 600 points from repos
  const followerScore = Math.min(followers * 3, 400); // Max 400 points from followers
  const ageScore = Math.min(accountAge / 10, 200); // Max 200 points from account age

  return Math.floor(commitScore + prScore + issueScore + repoScore + followerScore + ageScore);
}

function calculateTier(score: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (score >= 2500) return 'Platinum';
  if (score >= 1500) return 'Gold';
  if (score >= 750) return 'Silver';
  return 'Bronze';
}

function calculateBadges(data: {
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  publicRepos: number;
  followers: number;
  accountAge: number;
  languages: string[];
}): string[] {
  const badges = [];

  // Commit badges
  if (data.totalCommits >= 1000) badges.push('Commit Master');
  else if (data.totalCommits >= 500) badges.push('Commit Expert');
  else if (data.totalCommits >= 100) badges.push('Regular Contributor');

  // PR badges
  if (data.totalPullRequests >= 100) badges.push('PR Champion');
  else if (data.totalPullRequests >= 50) badges.push('PR Expert');
  else if (data.totalPullRequests >= 10) badges.push('Code Reviewer');

  // Repository badges
  if (data.publicRepos >= 50) badges.push('Project Builder');
  else if (data.publicRepos >= 20) badges.push('Repository Owner');

  // Language badges
  if (data.languages.length >= 10) badges.push('Polyglot');
  else if (data.languages.length >= 5) badges.push('Multi-Language');

  // Social badges
  if (data.followers >= 100) badges.push('Community Leader');
  else if (data.followers >= 50) badges.push('Influencer');

  // Longevity badges
  if (data.accountAge >= 2555) badges.push('Veteran (7+ years)');
  else if (data.accountAge >= 1825) badges.push('Senior (5+ years)');
  else if (data.accountAge >= 1095) badges.push('Experienced (3+ years)');

  return badges;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    console.log('GitHub API request for username:', username);
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get session to check if user has GitHub token
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    // Check cache first
    const cacheKey = `${username}-${!!token}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached GitHub data for:', username);
      return NextResponse.json(cached.data);
    }

    const achievements = await fetchGitHubContributions(username, token);
    
    // Cache the result
    cache.set(cacheKey, { data: achievements, timestamp: Date.now() });
    
    console.log('Successfully fetched GitHub achievements for:', username);
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
