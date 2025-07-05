import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Mock database for demo purposes - in production, this would be a real database
const mockCarvIdDatabase = new Map<string, {
  tokenId: number;
  owner: string;
  identityHash: string;
  web2Achievements?: any;
  metadata: {
    provider: string;
    email?: string;
    username?: string;
    createdAt: string;
  };
}>();

// Initialize with some mock data for demonstration
mockCarvIdDatabase.set('0x1234567890123456789012345678901234567890', {
  tokenId: 1,
  owner: '0x1234567890123456789012345678901234567890',
  identityHash: '0xabc123...',
  web2Achievements: {
    totalScore: 2850,
    overallTier: 'Gold',
    providers: [
      {
        provider: 'github',
        achievements: {
          tier: 'Gold',
          score: 1950,
          badges: ['Commit Master', 'PR Expert', 'Polyglot']
        }
      }
    ],
    combinedBadges: ['Commit Master', 'PR Expert', 'Polyglot', 'Multi-Platform User'],
    achievementHash: '0xdef456...'
  },
  metadata: {
    provider: 'github',
    username: 'example_user',
    createdAt: '2024-01-01T00:00:00Z'
  }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Normalize address
    const normalizedAddress = address.toLowerCase();
    
    // In a real implementation, you would:
    // 1. Query the ModularCarvID contract to get the tokenId for this address
    // 2. Get the identityHash from the contract
    // 3. Look up the Web2 achievements data in your database
    
    const carvIdData = mockCarvIdDatabase.get(normalizedAddress);
    
    if (!carvIdData) {
      // Try to query the contract for real data (if deployed)
      try {
        // This would be the actual contract query
        // const { ethers } = await import("ethers");
        // const provider = new ethers.JsonRpcProvider(process.env.BNB_TESTNET_RPC);
        // const contract = new ethers.Contract(CONTRACT_ADDRESS, ModularCarvID_ABI, provider);
        // const tokenId = await contract.walletToTokenId(normalizedAddress);
        // const identityHash = await contract.getIdentitiesRoot(tokenId);
        
        return NextResponse.json({
          error: 'No CARV ID found for this address',
          suggestion: 'Mint a CARV ID first to bind Web2 achievements'
        }, { status: 404 });
      } catch (error) {
        return NextResponse.json({
          error: 'No CARV ID found for this address',
          suggestion: 'Mint a CARV ID first to bind Web2 achievements'
        }, { status: 404 });
      }
    }

    // Calculate reputation score based on Web2 achievements
    const reputationData = {
      address: normalizedAddress,
      tokenId: carvIdData.tokenId,
      identityHash: carvIdData.identityHash,
      reputation: {
        totalScore: carvIdData.web2Achievements?.totalScore || 0,
        tier: carvIdData.web2Achievements?.overallTier || 'Bronze',
        badges: carvIdData.web2Achievements?.combinedBadges || [],
        breakdown: carvIdData.web2Achievements?.providers || []
      },
      metadata: carvIdData.metadata,
      achievements: {
        web2: carvIdData.web2Achievements,
        onChainHash: carvIdData.web2Achievements?.achievementHash
      },
      createdAt: carvIdData.metadata.createdAt,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(reputationData);
  } catch (error) {
    console.error('Reputation API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reputation data' },
      { status: 500 }
    );
  }
}

// Store/update Web2 achievements for a CARV ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, web2Achievements, signature } = body;
    
    if (!address || !web2Achievements) {
      return NextResponse.json({ 
        error: 'Address and web2Achievements are required' 
      }, { status: 400 });
    }

    // In production, you would:
    // 1. Verify the signature to ensure the request is from the wallet owner
    // 2. Update your database with the new Web2 achievements
    // 3. Optionally update the on-chain identityHash

    const normalizedAddress = address.toLowerCase();
    
    // Mock update
    if (mockCarvIdDatabase.has(normalizedAddress)) {
      const existingData = mockCarvIdDatabase.get(normalizedAddress)!;
      existingData.web2Achievements = web2Achievements;
      mockCarvIdDatabase.set(normalizedAddress, existingData);
      
      return NextResponse.json({
        success: true,
        message: 'Web2 achievements updated successfully',
        data: existingData
      });
    } else {
      return NextResponse.json({ 
        error: 'No CARV ID found for this address' 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Reputation update error:', error);
    return NextResponse.json(
      { error: 'Failed to update reputation data' },
      { status: 500 }
    );
  }
}
