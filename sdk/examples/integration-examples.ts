import { Fair3ReputationSDK, FAIR3_CONSTANTS } from '@mustafair/reputation-sdk';

/**
 * Example: Basic SDK Usage
 * Demonstrates how to use the SDK for public API access without authentication
 */

async function basicExample() {
  // Initialize the SDK
  const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app');
  
  const testAddress = '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3';
  
  try {
    // Get complete user profile
    console.log('🔍 Fetching user profile...');
    const profile = await sdk.getProfile(testAddress);
    console.log('Profile:', {
      wallet: profile.wallet,
      hasReputation: !!profile.reputation,
      hasCarvId: !!profile.carvId,
      tier: profile.reputation?.tier,
      score: profile.reputation?.contributionScore
    });
    
    // Check specific capabilities
    console.log('\n🔎 Checking user capabilities...');
    const hasReputation = await sdk.hasReputation(testAddress);
    const hasCarvId = await sdk.hasCarvId(testAddress);
    console.log('Has Reputation NFT:', hasReputation);
    console.log('Has CARV ID:', hasCarvId);
    
    // Get leaderboard
    console.log('\n🏆 Fetching leaderboard...');
    const leaderboard = await sdk.getLeaderboard({
      tier: 'Gold',
      sortBy: 'score',
      sortOrder: 'desc',
      limit: 5
    });
    console.log('Top Gold users:', leaderboard.reputations.map(u => ({
      wallet: u.wallet,
      score: u.contributionScore,
      tier: u.tier
    })));
    
    // Get platform statistics
    console.log('\n📊 Platform statistics...');
    const stats = await sdk.getStats();
    console.log('Platform stats:', {
      totalUsers: stats.platform.totalUsers,
      totalReputationNFTs: stats.platform.totalReputationNFTs,
      averageScore: stats.reputation.averageScore,
      tierDistribution: stats.reputation.tierDistribution
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Authentication with CARV ID
 * Demonstrates wallet integration and authentication flow
 */

async function authenticationExample() {
  // Initialize SDK with authentication config
  const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app', 10000, {
    contractAddress: FAIR3_CONSTANTS.CONTRACT_ADDRESSES[97], // BSC Testnet
    chainId: 97,
    requiredChains: [97, 31337]
  });
  
  // Simulate wallet connection (you would get this from wagmi, viem, etc.)
  const mockWalletConnection = {
    address: '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
    isConnected: true,
    chainId: 97
  };
  
  // Initialize with wallet connection
  await sdk.initialize(mockWalletConnection);
  
  console.log('🔗 Wallet connected:', sdk.isWalletReady());
  
  // Mock signature function (you would use actual wallet signing)
  const mockSignMessage = async (message: string): Promise<string> => {
    console.log('📝 Signing message:', message);
    // This would be replaced with actual wallet.signMessage() call
    return '0x' + 'mock_signature_' + Date.now().toString(16);
  };
  
  try {
    // Authenticate with CARV ID
    console.log('🔐 Authenticating with CARV ID...');
    const authResult = await sdk.authenticateWithCarvId(mockSignMessage, {
      fetchMetadata: true,
      fetchWeb2Achievements: true
    });
    
    if (authResult.success) {
      console.log('✅ Authentication successful!');
      console.log('User data:', {
        address: authResult.user?.address,
        tokenId: authResult.user?.tokenId,
        identityHash: authResult.user?.identityHash
      });
    } else {
      console.log('❌ Authentication failed:', authResult.error);
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
  }
}

/**
 * Example: Utility functions
 * Demonstrates helper and utility methods
 */

function utilityExample() {
  console.log('🛠️ SDK Utilities\n');
  
  // Validate addresses
  const addresses = [
    '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3', // valid
    '0xinvalid', // invalid
    '0x123' // too short
  ];
  
  const validation = Fair3ReputationSDK.validateAddresses(addresses);
  console.log('Address validation:', validation);
  
  // Tier comparisons
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  console.log('\nTier values:');
  tiers.forEach(tier => {
    console.log(`${tier}: ${Fair3ReputationSDK.getTierValue(tier)}`);
  });
  
  // Score formatting
  const scores = [500, 1500, 1000000, 2500000];
  console.log('\nFormatted scores:');
  scores.forEach(score => {
    console.log(`${score} -> ${Fair3ReputationSDK.formatScore(score)}`);
  });
  
  // Constants
  console.log('\nSDK Constants:');
  console.log('Supported chains:', FAIR3_CONSTANTS.SUPPORTED_CHAINS.length);
  console.log('Contract addresses:', Object.keys(FAIR3_CONSTANTS.CONTRACT_ADDRESSES));
  console.log('API endpoints:', Object.keys(FAIR3_CONSTANTS.API_ENDPOINTS));
}

/**
 * Example: Batch operations
 * Demonstrates efficient batch processing
 */

async function batchExample() {
  const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app');
  
  const addresses = [
    '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
    '0x456B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8D4',
    '0x789B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8E5'
  ];
  
  try {
    console.log('📦 Batch fetching profiles...');
    const profiles = await sdk.getBatchProfiles(addresses, {
      maxConcurrent: 2,
      includeErrors: true
    });
    
    profiles.forEach(result => {
      if (result.profile) {
        console.log(`✅ ${result.address}: ${result.profile.reputation?.tier || 'No reputation'}`);
      } else if (result.error) {
        console.log(`❌ ${result.address}: ${result.error}`);
      } else {
        console.log(`⚠️ ${result.address}: No data`);
      }
    });
    
  } catch (error) {
    console.error('Batch operation error:', error);
  }
}

/**
 * Example: Requirements checking
 * Demonstrates how to check if users meet specific criteria
 */

async function requirementsExample() {
  const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app');
  const testAddress = '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3';
  
  const requirements = {
    minScore: 1000,
    minTier: 'Silver' as const,
    requireCarvId: true
  };
  
  try {
    console.log('📋 Checking user requirements...');
    const check = await sdk.checkReputationRequirements(testAddress, requirements);
    
    console.log('Requirements check:', {
      meets: check.meets,
      reasons: check.reasons
    });
    
    if (check.meets) {
      console.log('✅ User meets all requirements!');
    } else {
      console.log('❌ User does not meet requirements:', check.reasons.join(', '));
    }
    
  } catch (error) {
    console.error('Requirements check error:', error);
  }
}

// Run examples
async function runExamples() {
  console.log('🚀 Fair3 Reputation SDK Examples\n');
  console.log('='.repeat(50));
  
  console.log('\n1. Basic Usage Example');
  console.log('-'.repeat(30));
  await basicExample();
  
  console.log('\n\n2. Authentication Example');
  console.log('-'.repeat(30));
  await authenticationExample();
  
  console.log('\n\n3. Utility Example');
  console.log('-'.repeat(30));
  utilityExample();
  
  console.log('\n\n4. Batch Operations Example');
  console.log('-'.repeat(30));
  await batchExample();
  
  console.log('\n\n5. Requirements Check Example');
  console.log('-'.repeat(30));
  await requirementsExample();
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Examples completed!');
}

// Export for use in other files
export {
  basicExample,
  authenticationExample,
  utilityExample,
  batchExample,
  requirementsExample,
  runExamples
};

// Run if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}
