import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

interface Web2Achievement {
  provider: 'github' | 'google';
  data: any;
  achievements: {
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    badges: string[];
    score: number;
  };
}

interface AggregatedWeb2Achievements {
  totalScore: number;
  overallTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  providers: Web2Achievement[];
  combinedBadges: string[];
  metadata: {
    githubCommits?: number;
    githubRepos?: number;
    googleAccountAge?: number;
    googleEmailCount?: number;
    lastUpdated: string;
  };
  achievementHash: string; // Hash for on-chain storage
}

async function fetchGitHubData(username: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/github/contributions?username=${username}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Failed to fetch GitHub data:', error);
  }
  return null;
}

async function fetchGoogleData(email: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/google/achievements?email=${email}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Failed to fetch Google data:', error);
  }
  return null;
}

function calculateOverallTier(totalScore: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (totalScore >= 3500) return 'Platinum';
  if (totalScore >= 2000) return 'Gold';
  if (totalScore >= 1000) return 'Silver';
  return 'Bronze';
}

function combineBadges(providers: Web2Achievement[]): string[] {
  const allBadges = providers.flatMap(p => p.achievements.badges);
  const uniqueBadges = [...new Set(allBadges)];
  
  // Add cross-platform badges
  const crossPlatformBadges = [];
  const hasGitHub = providers.some(p => p.provider === 'github');
  const hasGoogle = providers.some(p => p.provider === 'google');
  
  if (hasGitHub && hasGoogle) {
    crossPlatformBadges.push('Multi-Platform User');
    
    const totalScore = providers.reduce((sum, p) => sum + p.achievements.score, 0);
    if (totalScore >= 3000) crossPlatformBadges.push('Web2 Champion');
    else if (totalScore >= 2000) crossPlatformBadges.push('Web2 Expert');
    else if (totalScore >= 1000) crossPlatformBadges.push('Web2 Achiever');
  }
  
  return [...uniqueBadges, ...crossPlatformBadges];
}

function createAchievementHash(data: AggregatedWeb2Achievements): string {
  const hashData = {
    totalScore: data.totalScore,
    overallTier: data.overallTier,
    providers: data.providers.map(p => ({
      provider: p.provider,
      score: p.achievements.score,
      tier: p.achievements.tier
    })),
    badges: data.combinedBadges.sort(),
    timestamp: Math.floor(Date.now() / (1000 * 60 * 60 * 24)) // Daily resolution
  };
  
  return createHash('sha256')
    .update(JSON.stringify(hashData))
    .digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identities } = body;
    
    if (!identities || !Array.isArray(identities)) {
      return NextResponse.json({ error: 'Identities array is required' }, { status: 400 });
    }

    const providers: Web2Achievement[] = [];
    const metadata: any = {
      lastUpdated: new Date().toISOString()
    };

    // Process each identity
    for (const identity of identities) {
      if (identity.provider === 'github' && identity.username) {
        const githubData = await fetchGitHubData(identity.username);
        if (githubData) {
          providers.push({
            provider: 'github',
            data: githubData,
            achievements: githubData.achievements
          });
          
          metadata.githubCommits = githubData.totalCommits;
          metadata.githubRepos = githubData.totalRepositories;
        }
      } else if (identity.provider === 'google' && identity.email) {
        const googleData = await fetchGoogleData(identity.email);
        if (googleData) {
          providers.push({
            provider: 'google',
            data: googleData,
            achievements: googleData.achievements
          });
          
          metadata.googleAccountAge = googleData.accountAge;
          metadata.googleEmailCount = googleData.emailUsage.totalEmails;
        }
      }
    }

    if (providers.length === 0) {
      return NextResponse.json({ error: 'No valid Web2 data found' }, { status: 404 });
    }

    const totalScore = providers.reduce((sum, p) => sum + p.achievements.score, 0);
    const overallTier = calculateOverallTier(totalScore);
    const combinedBadges = combineBadges(providers);

    const aggregatedAchievements: AggregatedWeb2Achievements = {
      totalScore,
      overallTier,
      providers,
      combinedBadges,
      metadata,
      achievementHash: '' // Will be set below
    };

    // Create hash after we have all the data
    aggregatedAchievements.achievementHash = createAchievementHash(aggregatedAchievements);

    return NextResponse.json(aggregatedAchievements);
  } catch (error) {
    console.error('Web2 achievements aggregation error:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate Web2 achievements' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const github = searchParams.get('github');
    const google = searchParams.get('google');

    const identities = [];
    if (github) identities.push({ provider: 'github', username: github });
    if (google) identities.push({ provider: 'google', email: google });

    if (identities.length === 0) {
      return NextResponse.json({ error: 'At least one identity (github or google) is required' }, { status: 400 });
    }

    // Forward to POST method
    const response = await fetch(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identities })
    });

    return response;
  } catch (error) {
    console.error('Web2 achievements GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Web2 achievements' },
      { status: 500 }
    );
  }
}
