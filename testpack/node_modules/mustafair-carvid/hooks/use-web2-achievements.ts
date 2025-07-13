import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';

interface Web2Achievement {
    provider: 'github' | 'google';
    data: any;
    achievements: {
      tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
      badges: string[];
      score: number;
    };
}

interface Web2AchievementData {
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
  achievementHash: string;
}

interface UseWeb2AchievementsReturn {
  achievements: Web2AchievementData | null;
  loading: boolean;
  error: string | null;
  fetchAchievements: () => Promise<void>;
  lastFetched: Date | null;
}

// Global cache to prevent redundant API calls
const achievementCache = new Map<string, {
  data: Web2AchievementData;
  timestamp: number;
  expiresAt: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_DELAY = 2000; // 2 seconds between calls

let lastCallTime = 0;

export function useWeb2Achievements(): UseWeb2AchievementsReturn {
  const { data: session } = useSession();
  const { address } = useAccount();
  const [achievements, setAchievements] = useState<Web2AchievementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchAchievements = useCallback(async () => {
    if (!session) return;

    // Rate limiting protection
    const now = Date.now();
    if (now - lastCallTime < RATE_LIMIT_DELAY) {
      console.log('Rate limiting: Skipping API call, too soon since last call');
      return;
    }

    // Create cache key based on session data
    const cacheKey = `${session.provider}-${session.username || session.user?.email}`;
    
    // Check cache first
    const cached = achievementCache.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      console.log('Using cached achievements data');
      setAchievements(cached.data);
      setLastFetched(new Date(cached.timestamp));
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    lastCallTime = now;

    try {
      console.log('Fetching fresh achievements data...');
      
      const identities = [];
      
      if (session.provider === 'github' && session.username) {
        identities.push({ provider: 'github', username: session.username });
      } else if (session.provider === 'google' && session.user?.email) {
        identities.push({ provider: 'google', email: session.user.email });
      }

      if (identities.length === 0) {
        throw new Error('No valid identities found');
      }

      const response = await fetch('/api/web2/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identities })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch achievements: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      achievementCache.set(cacheKey, {
        data,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      });

      setAchievements(data);
      setLastFetched(new Date());
      console.log('Successfully fetched and cached achievements');
      
    } catch (err) {
      console.error('Failed to fetch Web2 achievements:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Remove auto-fetch on mount - let user manually initiate
  // useEffect(() => {
  //   if (session && (session.username || session.provider === 'carv-id')) {
  //     fetchAchievements();
  //   }
  // }, [session, fetchAchievements]);

  const bindToWallet = useCallback(async (walletAddress: string): Promise<boolean> => {
    if (!achievements) {
      setError('No achievements to bind');
      return false;
    }

    try {
      const response = await fetch(`/api/reputation/${walletAddress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: walletAddress,
          web2Achievements: achievements,
          // In production, you'd include a signature here
          signature: 'mock_signature'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to bind achievements: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to bind achievements to wallet:', err);
      return false;
    }
  }, [achievements]);

  const getReputationByAddress = useCallback(async (addressToQuery: string) => {
    try {
      const response = await fetch(`/api/reputation/${addressToQuery}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No reputation data found
        }
        throw new Error(`Failed to fetch reputation: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to fetch reputation by address:', err);
      throw err;
    }
  }, []);

  return {
    achievements,
    loading,
    error,
    fetchAchievements,
    lastFetched,
  };
}
