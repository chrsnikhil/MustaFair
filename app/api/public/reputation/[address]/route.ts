import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid Ethereum address format',
          code: 'INVALID_ADDRESS'
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const contractInfo = getContractInfo();
    if (!contractInfo) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Smart contracts not deployed',
          message: 'Rep-NFT and CARV ID contracts are not yet deployed',
          code: 'CONTRACTS_NOT_DEPLOYED',
          mockData: {
            wallet: address,
            reputation: null,
            carvId: null,
            network: 'BNB Testnet',
            chainId: 97
          }
        },
        { status: 503, headers: corsHeaders }
      );
    }

    // Initialize contracts
    const repNFTContract = contractInfo.reputationNFT.address ? 
      new ethers.Contract(contractInfo.reputationNFT.address, contractInfo.reputationNFT.abi, provider) : null;
    
    const carvIdContract = contractInfo.carvId.address ? 
      new ethers.Contract(contractInfo.carvId.address, contractInfo.carvId.abi, provider) : null;

    // Fetch reputation data
    let reputationData = null;
    if (repNFTContract) {
      try {
        const repData = await repNFTContract.getReputationByWallet(address);
        const [tokenId, contributionScore, tier, creationDate, carvIdHash, isActive] = repData;
        
        const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum'];
        const tierName = tierNames[Number(tier)];
        
        // Get token metadata
        let metadata = null;
        try {
          const tokenURI = await repNFTContract.tokenURI(tokenId);
          if (tokenURI.startsWith('data:application/json;base64,')) {
            const base64Data = tokenURI.replace('data:application/json;base64,', '');
            metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf8'));
          }
        } catch (error) {
          console.warn('Could not fetch token metadata:', error);
        }

        reputationData = {
          tokenId: tokenId.toString(),
          contributionScore: Number(contributionScore),
          tier: tierName,
          tierLevel: Number(tier),
          creationDate: new Date(Number(creationDate) * 1000).toISOString(),
          carvIdLinked: carvIdHash !== '0x0000000000000000000000000000000000000000000000000000000000000000',
          carvIdHash,
          isActive,
          metadata,
          contractAddress: contractInfo.reputationNFT.address
        };
      } catch (error: any) {
        if (!error.reason?.includes('No reputation NFT found')) {
          console.warn('Error fetching reputation data:', error);
        }
      }
    }

    // Fetch CARV ID data
    let carvIdData = null;
    if (carvIdContract) {
      try {
        const tokenId = await carvIdContract.walletToTokenId(address);
        if (tokenId && Number(tokenId) > 0) {
          const tokenURI = await carvIdContract.tokenURI(tokenId);
          
          let metadata = null;
          if (tokenURI.startsWith('data:application/json;base64,')) {
            const base64Data = tokenURI.replace('data:application/json;base64,', '');
            metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf8'));
          }

          carvIdData = {
            tokenId: tokenId.toString(),
            metadata,
            contractAddress: contractInfo.carvId.address,
            isValid: true
          };
        }
      } catch (error: any) {
        if (!error.reason?.includes('No token found')) {
          console.warn('Error fetching CARV ID data:', error);
        }
      }
    }

    // Fetch Web2 achievements if CARV ID exists
    let web2Achievements = null;
    if (carvIdData) {
      try {
        // Try to fetch from our Web2 achievements API
        const achievementsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/web2/achievements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            identities: [
              { provider: 'github', username: 'demo' },
              { provider: 'google', email: 'demo@example.com' }
            ]
          })
        });

        if (achievementsResponse.ok) {
          web2Achievements = await achievementsResponse.json();
        }
      } catch (error) {
        console.warn('Failed to fetch Web2 achievements:', error);
      }
    }

    const response = {
      success: true,
      data: {
        wallet: address,
        reputation: reputationData,
        carvId: carvIdData,
        web2Achievements,
        network: 'BNB Testnet',
        chainId: 97,
        contracts: {
          reputationNFT: contractInfo.reputationNFT.address,
          carvId: contractInfo.carvId.address
        },
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(response, { headers: corsHeaders });

  } catch (error: any) {
    console.error('Error in public reputation API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch reputation and identity data',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
