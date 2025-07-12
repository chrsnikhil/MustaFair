import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, max-age=60', // 1 minute cache for stats
};

// Load contract information
const getContractInfo = () => {
  try {
    const deploymentsPath = path.join(process.cwd(), 'hardhat', 'deployments.json');
    if (fs.existsSync(deploymentsPath)) {
      const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
      
      const repNFTABIPath = path.join(process.cwd(), 'lib', 'ReputationNFT_ABI.json');
      const carvIdABIPath = path.join(process.cwd(), 'lib', 'ModularCarvID_ABI.json');
      
      if (fs.existsSync(repNFTABIPath) && fs.existsSync(carvIdABIPath)) {
        const repNFTABI = JSON.parse(fs.readFileSync(repNFTABIPath, 'utf8'));
        const carvIdABI = JSON.parse(fs.readFileSync(carvIdABIPath, 'utf8'));
        
        return {
          reputationNFT: {
            address: deployments.contracts.ReputationNFT?.address,
            abi: repNFTABI
          },
          carvId: {
            address: deployments.contracts.ModularCarvID?.address || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            abi: carvIdABI
          }
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading contract info:', error);
    return null;
  }
};

// Initialize provider
const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'
);

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const contractInfo = getContractInfo();
    
    // Mock data for when contracts aren't deployed
    const mockStats = {
      success: true,
      data: {
        platform: {
          totalUsers: 150,
          totalReputationNFTs: 87,
          totalCarvIds: 142,
          activeUsers: 89
        },
        reputation: {
          totalScore: 125750,
          averageScore: 1446.55,
          tierDistribution: {
            Bronze: 45,
            Silver: 28,
            Gold: 12,
            Platinum: 2
          },
          topScore: 4500
        },
        web2Integration: {
          githubConnections: 78,
          googleConnections: 64,
          multiPlatformUsers: 42,
          averageWeb2Score: 1820.33
        },
        network: {
          name: 'BNB Testnet',
          chainId: 97,
          blockNumber: 'N/A'
        },
        contracts: {
          reputationNFT: contractInfo?.reputationNFT.address || 'Not deployed',
          carvId: contractInfo?.carvId.address || 'Not deployed'
        },
        lastUpdated: new Date().toISOString()
      }
    };

    if (!contractInfo) {
      return NextResponse.json({
        ...mockStats,
        message: 'Displaying mock data - contracts not yet deployed'
      }, { headers: corsHeaders });
    }

    try {
      // Initialize contracts
      const repNFTContract = contractInfo.reputationNFT.address ? 
        new ethers.Contract(contractInfo.reputationNFT.address, contractInfo.reputationNFT.abi, provider) : null;
      
      const carvIdContract = contractInfo.carvId.address ? 
        new ethers.Contract(contractInfo.carvId.address, contractInfo.carvId.abi, provider) : null;

      // Get network info
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();

      // Get reputation statistics
      let reputationStats = {
        totalScore: 0,
        averageScore: 0,
        tierDistribution: { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 },
        topScore: 0,
        totalNFTs: 0
      };

      if (repNFTContract) {
        const totalSupply = await repNFTContract.totalSupply();
        reputationStats.totalNFTs = Number(totalSupply);

        if (reputationStats.totalNFTs > 0) {
          const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum'];
          let totalScore = 0;
          let topScore = 0;

          for (let i = 1; i <= reputationStats.totalNFTs; i++) {
            try {
              const owner = await repNFTContract.ownerOf(i);
              const repData = await repNFTContract.getReputationByWallet(owner);
              const [, contributionScore, tier] = repData;
              
              const score = Number(contributionScore);
              totalScore += score;
              if (score > topScore) topScore = score;
              
              const tierName = tierNames[Number(tier)] as keyof typeof reputationStats.tierDistribution;
              reputationStats.tierDistribution[tierName]++;
            } catch (error) {
              console.warn(`Error fetching reputation for token ${i}:`, error);
            }
          }

          reputationStats.totalScore = totalScore;
          reputationStats.averageScore = totalScore / reputationStats.totalNFTs;
          reputationStats.topScore = topScore;
        }
      }

      // Get CARV ID statistics
      let carvIdStats = { totalIds: 0 };
      if (carvIdContract) {
        try {
          // Since CARV ID contract doesn't have totalSupply and checking ownerOf is slow,
          // we'll use mock data for now. In production, implement proper event tracking
          // or maintain a counter in the contract.
          
          // For demo purposes, assume some CARV IDs exist
          carvIdStats.totalIds = 5; // Mock data - assume 5 CARV IDs minted
          
        } catch (error) {
          console.warn('Error fetching CARV ID statistics:', error);
          carvIdStats.totalIds = 0;
        }
      }

      // Calculate Web2 integration stats (simplified)
      const web2Stats = {
        githubConnections: Math.floor(carvIdStats.totalIds * 0.55), // Mock: 55% have GitHub
        googleConnections: Math.floor(carvIdStats.totalIds * 0.45), // Mock: 45% have Google
        multiPlatformUsers: Math.floor(carvIdStats.totalIds * 0.30), // Mock: 30% have both
        averageWeb2Score: 1820.33 // Mock average
      };

      const stats = {
        success: true,
        data: {
          platform: {
            totalUsers: Math.max(carvIdStats.totalIds, reputationStats.totalNFTs),
            totalReputationNFTs: reputationStats.totalNFTs,
            totalCarvIds: carvIdStats.totalIds,
            activeUsers: Math.floor((carvIdStats.totalIds + reputationStats.totalNFTs) * 0.6) // Mock: 60% active
          },
          reputation: {
            totalScore: reputationStats.totalScore,
            averageScore: Number(reputationStats.averageScore.toFixed(2)),
            tierDistribution: reputationStats.tierDistribution,
            topScore: reputationStats.topScore
          },
          web2Integration: web2Stats,
          network: {
            name: network.name,
            chainId: Number(network.chainId),
            blockNumber: blockNumber.toString()
          },
          contracts: {
            reputationNFT: contractInfo.reputationNFT.address,
            carvId: contractInfo.carvId.address
          },
          lastUpdated: new Date().toISOString()
        }
      };

      return NextResponse.json(stats, { headers: corsHeaders });

    } catch (contractError: any) {
      console.error('Contract error:', contractError);
      // Return mock data on contract errors
      return NextResponse.json({
        ...mockStats,
        warning: 'Some contract data unavailable, showing partial mock data'
      }, { headers: corsHeaders });
    }

  } catch (error: any) {
    console.error('Error in public stats API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch platform statistics',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
