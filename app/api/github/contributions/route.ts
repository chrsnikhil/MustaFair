import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

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
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    const reposData = await reposResponse.json();

    // Calculate contributions for each repository
    const contributions: GitHubContribution[] = [];
    let totalCommits = 0;
    let totalPullRequests = 0;
    let totalIssues = 0;
    const languages = new Set<string>();

    for (const repo of reposData.slice(0, 10)) { // Limit to top 10 repos to avoid API limits
      if (repo.owner.login === username) {
        try {
          // Fetch commits count
          const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`, { headers });
          const commitsCount = commitsResponse.headers.get('link') ? 
            parseInt(commitsResponse.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1] || '0') : 
            (await commitsResponse.json()).length;

          // Fetch pull requests
          const prsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/pulls?state=all&creator=${username}&per_page=1`, { headers });
          const prsCount = prsResponse.headers.get('link') ? 
            parseInt(prsResponse.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1] || '0') : 
            (await prsResponse.json()).length;

          // Fetch issues
          const issuesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/issues?state=all&creator=${username}&per_page=1`, { headers });
          const issuesCount = issuesResponse.headers.get('link') ? 
            parseInt(issuesResponse.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1] || '0') : 
            (await issuesResponse.json()).length;

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
      }
    }

    // Calculate account age
    const accountCreated = new Date(userData.created_at);
    const accountAge = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate achievement tier and score
    const score = calculateGitHubScore({
      totalCommits,
      totalPullRequests,
      totalIssues,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      accountAge
    });

    const tier = calculateTier(score);
    const badges = calculateBadges({
      totalCommits,
      totalPullRequests,
      totalIssues,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      accountAge,
      languages: Array.from(languages)
    });

    return {
      totalCommits,
      totalPullRequests,
      totalIssues,
      totalRepositories: userData.public_repos,
      languages: Array.from(languages),
      accountAge,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      contributions,
      achievements: {
        tier,
        badges,
        score
      }
    };
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    throw new Error('Failed to fetch GitHub data');
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
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get session to check if user has GitHub token
    const session = await getServerSession();
    const token = session?.accessToken; // You'd need to store this in the session

    const achievements = await fetchGitHubContributions(username, token);
    
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
