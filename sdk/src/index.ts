/**
 * FAIR3 Reputation SDK
 * 
 * A comprehensive TypeScript SDK for integrating CARV ID authentication and reputation systems
 * into decentralized applications. Provides wallet connection, CARV ID authentication,
 * reputation querying, and public API access.
 * 
 * @version 1.2.0
 * @author MustaFair Team
 * @license MIT
 */

// Re-export types for external usage
export type { WalletClient, PublicClient } from 'viem';
export type { Connector } from 'wagmi';

// Core interfaces for reputation and identity data
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

// Authentication and wallet interfaces
export interface WalletConnectionConfig {
  chains?: Array<{
    id: number;
    name: string;
    rpcUrls: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  }>;
  preferredConnectors?: string[];
  autoConnect?: boolean;
}

export interface CarvIdAuthConfig {
  contractAddress: string;
  chainId: number;
  requiredChains?: number[];
  signMessageTemplate?: string;
}

export interface AuthenticationResult {
  success: boolean;
  user?: {
    address: string;
    tokenId: string;
    signature: string;
    message: string;
    metadata?: any;
    web2Achievements?: any;
    identityHash: string;
  };
  error?: string;
}

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId: number;
  connector?: any;
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
  private walletConnection: WalletConnection | null = null;
  private authConfig: CarvIdAuthConfig | null = null;

  // Default CARV ID contract addresses for supported networks
  public static readonly DEFAULT_CONTRACTS = {
    97: "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3", // BSC Testnet
    31337: "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3", // Localhost
  };

  // Default supported chains
  public static readonly DEFAULT_CHAINS = [
    {
      id: 97,
      name: 'BSC Testnet',
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 }
    },
    {
      id: 31337,
      name: 'Localhost',
      rpcUrls: ['http://127.0.0.1:8545'],
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
    }
  ];

  constructor(
    baseUrl: string = 'https://musta-fair.vercel.app', 
    timeout: number = 10000,
    authConfig?: Partial<CarvIdAuthConfig>
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = timeout;
    
    // Set up authentication config with defaults
    this.authConfig = {
      contractAddress: authConfig?.contractAddress || Fair3ReputationSDK.DEFAULT_CONTRACTS[97],
      chainId: authConfig?.chainId || 97,
      requiredChains: authConfig?.requiredChains || [97, 31337],
      signMessageTemplate: authConfig?.signMessageTemplate || 'Sign this message to authenticate with CARV ID: {timestamp}',
      ...authConfig
    };
  }

  /**
   * Initialize the SDK with wallet connection
   * Call this before using authentication features
   */
  async initialize(walletConnection?: WalletConnection): Promise<void> {
    if (walletConnection) {
      this.walletConnection = walletConnection;
    }
    
    // Validate connection if provided
    if (this.walletConnection && !this.isValidAddress(this.walletConnection.address)) {
      throw new Error('Invalid wallet address in connection');
    }
  }

  /**
   * Set the current wallet connection
   * Used when integrating with external wallet providers
   */
  setWalletConnection(connection: WalletConnection): void {
    this.walletConnection = connection;
  }

  /**
   * Get current wallet connection status
   */
  getWalletConnection(): WalletConnection | null {
    return this.walletConnection;
  }

  /**
   * Check if wallet is connected and on supported chain
   */
  isWalletReady(): boolean {
    return !!(
      this.walletConnection?.isConnected &&
      this.walletConnection?.address &&
      this.authConfig?.requiredChains?.includes(this.walletConnection.chainId)
    );
  }

  /**
   * Authenticate with CARV ID using wallet signature
   * This method integrates with your authentication flow
   */
  async authenticateWithCarvId(
    signMessage: (message: string) => Promise<string>,
    options?: {
      fetchMetadata?: boolean;
      fetchWeb2Achievements?: boolean;
    }
  ): Promise<AuthenticationResult> {
    if (!this.walletConnection?.isConnected) {
      return { success: false, error: 'Wallet not connected' };
    }

    if (!this.isWalletReady()) {
      return { success: false, error: 'Wallet not on supported network' };
    }

    try {
      // Check if user has a CARV ID
      const hasIdentity = await this.hasCarvId(this.walletConnection.address);
      if (!hasIdentity) {
        return { success: false, error: 'No CARV ID found for this wallet. Please mint a CARV ID first.' };
      }

      // Generate message to sign
      const timestamp = Date.now();
      const message = this.authConfig!.signMessageTemplate!.replace('{timestamp}', timestamp.toString());

      // Get signature
      const signature = await signMessage(message);

      // Get CARV ID profile
      const profile = await this.getCarvIdProfile(this.walletConnection.address);
      
      // Prepare authentication data
      const authData = {
        address: this.walletConnection.address,
        tokenId: profile.tokenId || '',
        signature,
        message,
        metadata: options?.fetchMetadata ? profile.metadata : undefined,
        web2Achievements: options?.fetchWeb2Achievements ? profile.web2Achievements : undefined,
        identityHash: this.generateIdentityHash({
          address: this.walletConnection.address,
          tokenId: profile.tokenId || '',
          timestamp
        })
      };

      return {
        success: true,
        user: authData
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  /**
   * Generate a consistent identity hash for CARV ID
   */
  private generateIdentityHash(data: { address: string; tokenId: string; timestamp: number }): string {
    // Simple hash generation - in production, you might want to use a more robust method
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Mint a new CARV ID (requires wallet connection and transaction signing)
   * This is a convenience method that returns the transaction data
   */
  async prepareCarvIdMint(recipient?: string): Promise<{
    to: string;
    data: string;
    value: string;
    chainId: number;
  }> {
    if (!this.authConfig) {
      throw new Error('Authentication config not set');
    }

    const targetRecipient = recipient || this.walletConnection?.address;
    if (!targetRecipient) {
      throw new Error('No recipient address provided');
    }

    // Return transaction data for minting
    // The actual transaction execution should be handled by the integrating app
    return {
      to: this.authConfig.contractAddress,
      data: `0x40c10f19${targetRecipient.slice(2).padStart(64, '0')}${'1'.padStart(64, '0')}`, // mint(address,uint256)
      value: '0',
      chainId: this.authConfig.chainId
    };
  }

  /**
   * Get supported chains configuration
   */
  static getSupportedChains() {
    return Fair3ReputationSDK.DEFAULT_CHAINS;
  }

  /**
   * Get default contract addresses
   */
  static getDefaultContracts() {
    return Fair3ReputationSDK.DEFAULT_CONTRACTS;
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

  /**
   * Utility: Create a new SDK instance with different base URL
   */
  static create(baseUrl: string, timeout?: number, authConfig?: Partial<CarvIdAuthConfig>): Fair3ReputationSDK {
    return new Fair3ReputationSDK(baseUrl, timeout, authConfig);
  }

  /**
   * Utility: Validate multiple addresses at once
   */
  static validateAddresses(addresses: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];
    
    addresses.forEach(addr => {
      if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        valid.push(addr);
      } else {
        invalid.push(addr);
      }
    });
    
    return { valid, invalid };
  }

  /**
   * Utility: Get tier numeric value for comparison
   */
  static getTierValue(tier: string): number {
    const tierValues = { 'Bronze': 0, 'Silver': 1, 'Gold': 2, 'Platinum': 3 };
    return tierValues[tier as keyof typeof tierValues] || 0;
  }

  /**
   * Utility: Format contribution score with appropriate suffix
   */
  static formatScore(score: number): string {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toString();
  }

  /**
   * Utility: Check if an address has minimum reputation requirements
   */
  async checkReputationRequirements(
    address: string, 
    requirements: { 
      minScore?: number; 
      minTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'; 
      requireCarvId?: boolean;
    }
  ): Promise<{ meets: boolean; reasons: string[] }> {
    const reasons: string[] = [];
    
    try {
      const profile = await this.getProfile(address);
      
      if (requirements.requireCarvId && !profile.carvId) {
        reasons.push('CARV ID required but not found');
      }
      
      if (!profile.reputation) {
        reasons.push('No reputation NFT found');
        return { meets: false, reasons };
      }
      
      if (requirements.minScore && profile.reputation.contributionScore < requirements.minScore) {
        reasons.push(`Score ${profile.reputation.contributionScore} below minimum ${requirements.minScore}`);
      }
      
      if (requirements.minTier) {
        const currentTierValue = Fair3ReputationSDK.getTierValue(profile.reputation.tier);
        const requiredTierValue = Fair3ReputationSDK.getTierValue(requirements.minTier);
        
        if (currentTierValue < requiredTierValue) {
          reasons.push(`Tier ${profile.reputation.tier} below minimum ${requirements.minTier}`);
        }
      }
      
      return { meets: reasons.length === 0, reasons };
      
    } catch (error) {
      reasons.push(`Error checking requirements: ${error}`);
      return { meets: false, reasons };
    }
  }

  /**
   * Utility: Batch fetch profiles for multiple addresses
   */
  async getBatchProfiles(addresses: string[], options?: { 
    maxConcurrent?: number; 
    includeErrors?: boolean;
  }): Promise<Array<{ address: string; profile?: FullProfileData; error?: string }>> {
    const maxConcurrent = options?.maxConcurrent || 5;
    const results: Array<{ address: string; profile?: FullProfileData; error?: string }> = [];
    
    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < addresses.length; i += maxConcurrent) {
      const batch = addresses.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (address) => {
        try {
          const profile = await this.getProfile(address);
          return { address, profile };
        } catch (error: any) {
          if (options?.includeErrors) {
            return { address, error: error.message };
          }
          return { address };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }
}

// Create wagmi-compatible hook helpers (optional, for React integration)
export const createSDKHooks = (sdk: Fair3ReputationSDK) => {
  return {
    useProfile: (address?: string) => {
      // This would be implemented as a React hook in a React environment
      // For now, we provide the pattern
      return {
        data: null,
        loading: false,
        error: null,
        refetch: async () => address ? await sdk.getProfile(address) : null
      };
    },
    
    useAuthentication: () => {
      return {
        authenticate: sdk.authenticateWithCarvId.bind(sdk),
        isReady: sdk.isWalletReady(),
        connection: sdk.getWalletConnection()
      };
    }
  };
};

// Export configuration constants
export const FAIR3_CONSTANTS = {
  SUPPORTED_CHAINS: Fair3ReputationSDK.DEFAULT_CHAINS,
  CONTRACT_ADDRESSES: Fair3ReputationSDK.DEFAULT_CONTRACTS,
  TIER_VALUES: { 'Bronze': 0, 'Silver': 1, 'Gold': 2, 'Platinum': 3 } as const,
  API_ENDPOINTS: {
    REPUTATION: '/api/public/reputation',
    CARV_ID: '/api/public/carv-id',
    LEADERBOARD: '/api/public/leaderboard',
    STATS: '/api/public/stats'
  } as const
};

// Export a default instance for convenience
export const fair3SDK = new Fair3ReputationSDK();

// Export the class for custom instances
export default Fair3ReputationSDK;
