import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, max-age=300', // 5 minutes cache
};

// Load contract information
const getContractInfo = () => {
  try {
    const deploymentsPath = path.join(process.cwd(), 'hardhat', 'deployments.json');
    if (fs.existsSync(deploymentsPath)) {
      const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
      
      const repNFTABIPath = path.join(process.cwd(), 'lib', 'ReputationNFT_ABI.json');
      
      if (fs.existsSync(repNFTABIPath)) {
        const repNFTABI = JSON.parse(fs.readFileSync(repNFTABIPath, 'utf8'));
        
        return {
          address: deployments.contracts.ReputationNFT?.address,
          abi: repNFTABI
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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 per page
    const tier = searchParams.get('tier'); // Filter by tier: Bronze, Silver, Gold, Platinum
    const sortBy = searchParams.get('sortBy') || 'creationDate'; // score, creationDate, tier
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid pagination parameters',
          code: 'INVALID_PARAMS'
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const contractInfo = getContractInfo();
    if (!contractInfo) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Reputation NFT contract not deployed',
          message: 'The ReputationNFT contract is not yet deployed',
          code: 'CONTRACT_NOT_DEPLOYED',
          mockData: {
            totalCount: 0,
            page,
            limit,
            totalPages: 0,
            reputations: [],
            filters: { tier, sortBy, sortOrder },
            network: 'BNB Testnet',
            chainId: 97
          }
        },
        { status: 503, headers: corsHeaders }
      );
    }

    const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider);

    try {
      // Get total supply of reputation NFTs
      const totalSupply = await contract.totalSupply();
      const totalCount = Number(totalSupply);

      if (totalCount === 0) {
        return NextResponse.json({
          success: true,
          data: {
            totalCount: 0,
            page,
            limit,
            totalPages: 0,
            reputations: [],
            filters: { tier, sortBy, sortOrder },
            contractAddress: contractInfo.address,
            network: 'BNB Testnet',
            chainId: 97,
            timestamp: new Date().toISOString()
          }
        }, { headers: corsHeaders });
      }

      // Fetch all reputation data (in a production system, this would be optimized with events/indexing)
      const reputations = [];
      const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      const tierMap: { [key: string]: number } = {
        'Bronze': 0,
        'Silver': 1,
        'Gold': 2,
        'Platinum': 3
      };

      for (let i = 1; i <= totalCount; i++) {
        try {
          const owner = await contract.ownerOf(i);
          const repData = await contract.getReputationByWallet(owner);
          const [tokenId, contributionScore, tierNum, creationDate, carvIdHash, isActive] = repData;
          
          const tierName = tierNames[Number(tierNum)];
          
          // Apply tier filter
          if (tier && tierName !== tier) {
            continue;
          }

          // Get token metadata
          let metadata = null;
          try {
            const tokenURI = await contract.tokenURI(tokenId);
            if (tokenURI.startsWith('data:application/json;base64,')) {
              const base64Data = tokenURI.replace('data:application/json;base64,', '');
              metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf8'));
            }
          } catch (error) {
            console.warn(`Could not fetch metadata for token ${tokenId}:`, error);
          }

          reputations.push({
            tokenId: tokenId.toString(),
            wallet: owner,
            contributionScore: Number(contributionScore),
            tier: tierName,
            tierLevel: Number(tierNum),
            creationDate: new Date(Number(creationDate) * 1000).toISOString(),
            carvIdLinked: carvIdHash !== '0x0000000000000000000000000000000000000000000000000000000000000000',
            carvIdHash,
            isActive,
            metadata
          });

        } catch (error) {
          console.warn(`Error fetching reputation for token ${i}:`, error);
        }
      }

      // Sort the results
      reputations.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'score':
            comparison = a.contributionScore - b.contributionScore;
            break;
          case 'tier':
            comparison = a.tierLevel - b.tierLevel;
            break;
          case 'creationDate':
          default:
            comparison = new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
            break;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      // Apply pagination
      const totalPages = Math.ceil(reputations.length / limit);
      const startIndex = (page - 1) * limit;
      const paginatedReputations = reputations.slice(startIndex, startIndex + limit);

      const response = {
        success: true,
        data: {
          totalCount: reputations.length,
          page,
          limit,
          totalPages,
          reputations: paginatedReputations,
          filters: { tier, sortBy, sortOrder },
          contractAddress: contractInfo.address,
          network: 'BNB Testnet',
          chainId: 97,
          timestamp: new Date().toISOString()
        }
      };

      return NextResponse.json(response, { headers: corsHeaders });

    } catch (contractError: any) {
      console.error('Contract error:', contractError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Contract interaction failed',
          code: 'CONTRACT_ERROR',
          details: process.env.NODE_ENV === 'development' ? contractError.message : undefined
        },
        { status: 500, headers: corsHeaders }
      );
    }

  } catch (error: any) {
    console.error('Error in public leaderboard API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch reputation leaderboard',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
