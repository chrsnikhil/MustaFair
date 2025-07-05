import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';

interface Web2AchievementData {
  totalScore: number;
  overallTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  providers: Array<{
    provider: 'github' | 'google';
    data: any;
    achievements: {
      tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
      badges: string[];
      score: number;
    };
  }>;
  combinedBadges: string[];
  metadata: any;
  achievementHash: string;
}

interface UseWeb2AchievementsReturn {
  achievements: Web2AchievementData | null;
  loading: boolean;
  error: string | null;
  fetchAchievements: () => Promise<void>;
  bindToWallet: (walletAddress: string) => Promise<boolean>;
  getReputationByAddress: (address: string) => Promise<any>;
}

export function useWeb2Achievements(): UseWeb2AchievementsReturn {
  const { data: session } = useSession();
  const { address } = useAccount();
  const [achievements, setAchievements] = useState<Web2AchievementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    if (!session?.username || !session?.provider) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const identities = [];
      
      if (session.provider === 'github' && session.username) {
        identities.push({ provider: 'github', username: session.username });
      } else if (session.provider === 'google' && session.user?.email) {
        identities.push({ provider: 'google', email: session.user.email });
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
      setAchievements(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to fetch Web2 achievements:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

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
    bindToWallet,
    getReputationByAddress
  };
}
