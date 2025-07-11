/**
 * FAIR3 Reputation SDK
 * 
 * A TypeScript SDK for interacting with the MustaFair platform's public APIs
 * to query reputation NFTs and CARV ID profiles.
 * 
 * @version 1.0.0
 * @author MustaFair Team
 * @license MIT
 */

export interface ReputationData {
  tokenId: string;
  contributionScore: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierLevel: number;
  creationDate: string;
  carvIdLinked: boolean;
  carvIdHash: string;
  isActive: boolean;
  metadata: any;
  contractAddress: string;
}

export interface CarvIdData {
  tokenId: string;
  metadata: any;
  contractAddress: string;
  isValid: boolean;
}

export interface Web2Binding {
  provider: 'github' | 'google';
  username?: string;
  email?: string;
  verified: boolean;
  linkedAt: string;
}

export interface Web2Achievements {
  totalScore: number;
  overallTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  providers: any[];
  combinedBadges: string[];
  metadata: any;
  achievementHash: string;
}

export interface FullProfileData {
  wallet: string;
  reputation: ReputationData | null;
  carvId: CarvIdData | null;
  web2Achievements: Web2Achievements | null;
  network: string;
  chainId: number;
  contracts: {
    reputationNFT?: string;
    carvId?: string;
  };
  timestamp: string;
}

export interface CarvIdProfile {
  wallet: string;
  hasIdentity: boolean;
  tokenId: string | null;
  metadata: any;
  web2Bindings: Web2Binding[];
  web2Achievements: Web2Achievements | null;
  contractAddress: string;
  network: string;
  chainId: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  tokenId: string;
  wallet: string;
  contributionScore: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierLevel: number;
  creationDate: string;
  carvIdLinked: boolean;
  carvIdHash: string;
  isActive: boolean;
  metadata: any;
}

export interface LeaderboardData {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  reputations: LeaderboardEntry[];
  filters: {
    tier?: string;
    sortBy: string;
    sortOrder: string;
  };
  contractAddress: string;
  network: string;
  chainId: number;
  timestamp: string;
}

export interface PlatformStats {
  platform: {
    totalUsers: number;
    totalReputationNFTs: number;
    totalCarvIds: number;
    activeUsers: number;
  };
  reputation: {
    totalScore: number;
    averageScore: number;
    tierDistribution: {
      Bronze: number;
      Silver: number;
      Gold: number;
      Platinum: number;
    };
    topScore: number;
  };
  web2Integration: {
    githubConnections: number;
    googleConnections: number;
    multiPlatformUsers: number;
    averageWeb2Score: number;
  };
  network: {
    name: string;
    chainId: number;
    blockNumber: string;
  };
  contracts: {
    reputationNFT: string;
    carvId: string;
  };
  lastUpdated: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
  details?: string;
}

export interface LeaderboardFilters {
  page?: number;
  limit?: number;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  sortBy?: 'score' | 'creationDate' | 'tier';
  sortOrder?: 'asc' | 'desc';
}

export class Fair3ReputationSDK {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'https://mustafair.vercel.app', timeout: number = 10000) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = timeout;
  }

  /**
   * Validate Ethereum address format
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  private async makeRequest<T>(url: string): Promise<APIResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Get complete reputation and identity data for a wallet address
   * 
   * @param address - Ethereum wallet address
   * @returns Full profile data including reputation NFT, CARV ID, and Web2 achievements
   */
  async getProfile(address: string): Promise<FullProfileData> {
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid Ethereum address format');
    }

    const response = await this.makeRequest<FullProfileData>(
      `${this.baseUrl}/api/public/reputation/${address}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch profile data');
    }

    return response.data!;
  }

  /**
   * Get CARV ID profile and Web2 bindings for a wallet address
   * 
   * @param address - Ethereum wallet address
   * @returns CARV ID profile data
   */
  async getCarvIdProfile(address: string): Promise<CarvIdProfile> {
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid Ethereum address format');
    }

    const response = await this.makeRequest<CarvIdProfile>(
      `${this.baseUrl}/api/public/carv-id/${address}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch CARV ID profile');
    }

    return response.data!;
  }

  /**
   * Get reputation data only for a wallet address
   * 
   * @param address - Ethereum wallet address
   * @returns Reputation NFT data or null if not found
   */
  async getReputation(address: string): Promise<ReputationData | null> {
    const profile = await this.getProfile(address);
    return profile.reputation;
  }

  /**
   * Get reputation leaderboard with filtering and pagination
   * 
   * @param filters - Filtering and pagination options
   * @returns Paginated leaderboard data
   */
  async getLeaderboard(filters: LeaderboardFilters = {}): Promise<LeaderboardData> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.tier) params.append('tier', filters.tier);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const url = `${this.baseUrl}/api/public/leaderboard${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await this.makeRequest<LeaderboardData>(url);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch leaderboard');
    }

    return response.data!;
  }

  /**
   * Get platform-wide statistics and metrics
   * 
   * @returns Platform statistics
   */
  async getStats(): Promise<PlatformStats> {
    const response = await this.makeRequest<PlatformStats>(
      `${this.baseUrl}/api/public/stats`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch platform statistics');
    }

    return response.data!;
  }

  /**
   * Get top performers by tier
   * 
   * @param tier - Tier to filter by
   * @param limit - Number of results to return
   * @returns Top performers in the specified tier
   */
  async getTopPerformers(tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum', limit: number = 10): Promise<LeaderboardEntry[]> {
    const leaderboard = await this.getLeaderboard({
      tier,
      limit,
      sortBy: 'score',
      sortOrder: 'desc'
    });

    return leaderboard.reputations;
  }

  /**
   * Check if a wallet has a reputation NFT
   * 
   * @param address - Ethereum wallet address
   * @returns Boolean indicating if wallet has a reputation NFT
   */
  async hasReputation(address: string): Promise<boolean> {
    try {
      const reputation = await this.getReputation(address);
      return reputation !== null && reputation.isActive;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a wallet has a CARV ID
   * 
   * @param address - Ethereum wallet address
   * @returns Boolean indicating if wallet has a CARV ID
   */
  async hasCarvId(address: string): Promise<boolean> {
    try {
      const profile = await this.getCarvIdProfile(address);
      return profile.hasIdentity;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user's tier and score
   * 
   * @param address - Ethereum wallet address
   * @returns Tier and score information
   */
  async getTierInfo(address: string): Promise<{ tier: string; score: number; tierLevel: number } | null> {
    const reputation = await this.getReputation(address);
    
    if (!reputation) {
      return null;
    }

    return {
      tier: reputation.tier,
      score: reputation.contributionScore,
      tierLevel: reputation.tierLevel
    };
  }

  /**
   * Search for wallets by tier
   * 
   * @param tier - Tier to search for
   * @param page - Page number
   * @param limit - Results per page
   * @returns Wallets with the specified tier
   */
  async searchByTier(tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum', page: number = 1, limit: number = 20): Promise<LeaderboardEntry[]> {
    const leaderboard = await this.getLeaderboard({ tier, page, limit });
    return leaderboard.reputations;
  }

  /**
   * Get API documentation and health status
   * 
   * @returns API documentation object
   */
  async getDocs(): Promise<any> {
    const response = await this.makeRequest<any>(
      `${this.baseUrl}/api/public/docs`
    );

    return response;
  }
}

// Export a default instance for convenience
export const fair3SDK = new Fair3ReputationSDK();

// Export the class for custom instances
export default Fair3ReputationSDK;
