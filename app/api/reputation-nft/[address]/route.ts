import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// Load contract ABIs and addresses
const getContractInfo = () => {
  try {
    const deploymentsPath = path.join(process.cwd(), 'hardhat', 'deployments.json');
    if (fs.existsSync(deploymentsPath)) {
      const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
      
      const repNFTABIPath = path.join(process.cwd(), 'lib', 'ReputationNFT_ABI.json');
      if (fs.existsSync(repNFTABIPath)) {
        const repNFTABI = JSON.parse(fs.readFileSync(repNFTABIPath, 'utf8'));
        
        return {
          address: deployments.contracts.ReputationNFT.address,
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
const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    const contractInfo = getContractInfo();
    if (!contractInfo) {
      return NextResponse.json(
        { 
          error: 'Contract not deployed yet',
          message: 'Please deploy the ReputationNFT contract first',
          mockData: {
            wallet: address,
            tokenId: null,
            contributionScore: 0,
            tier: 'Bronze',
            tierLevel: 0,
            creationDate: null,
            carvIdLinked: false,
            isActive: false,
            contractAddress: null,
            network: 'BNB Testnet',
            chainId: 97
          }
        },
        { status: 503 }
      );
    }

    const contract = new ethers.Contract(
      contractInfo.address,
      contractInfo.abi,
      provider
    );

    try {
      // Get reputation data for the wallet
      const reputationData = await contract.getReputationByWallet(address);
      
      const [tokenId, contributionScore, tier, creationDate, carvIdHash, isActive] = reputationData;
      
      // Convert tier enum to string
      const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      const tierName = tierNames[Number(tier)];
      
      // Get token URI for metadata
      let metadata = null;
      try {
        const tokenURI = await contract.tokenURI(tokenId);
        if (tokenURI.startsWith('data:application/json;base64,')) {
          const base64Data = tokenURI.replace('data:application/json;base64,', '');
          metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf8'));
        }
      } catch (error) {
        console.warn('Could not fetch token metadata:', error);
      }

      const response = {
        success: true,
        data: {
          wallet: address,
          tokenId: tokenId.toString(),
          contributionScore: contributionScore.toString(),
          tier: tierName,
          tierLevel: Number(tier),
          creationDate: new Date(Number(creationDate) * 1000).toISOString(),
          carvIdLinked: carvIdHash !== '0x0000000000000000000000000000000000000000000000000000000000000000',
          carvIdHash: carvIdHash,
          isActive,
          metadata,
          contractAddress: contractInfo.address,
          network: 'BNB Testnet',
          chainId: 97
        }
      };

      return NextResponse.json(response);
      
    } catch (contractError: any) {
      if (contractError.reason && contractError.reason.includes('No reputation NFT found')) {
        return NextResponse.json({
          success: true,
          data: null,
          message: 'No reputation NFT found for this address'
        });
      }
      
      throw contractError;
    }

  } catch (error: any) {
    console.error('Error fetching reputation data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch reputation data',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const body = await request.json();
    const { action, ...actionData } = body;

    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    const contractInfo = getContractInfo();
    if (!contractInfo) {
      return NextResponse.json(
        { error: 'Contract information not available' },
        { status: 500 }
      );
    }

    const contract = new ethers.Contract(
      contractInfo.address,
      contractInfo.abi,
      provider
    );

    switch (action) {
      case 'mint':
        const { contributionScore, tier } = actionData;
        
        if (typeof contributionScore !== 'number' || contributionScore < 0) {
          return NextResponse.json(
            { error: 'Invalid contribution score' },
            { status: 400 }
          );
        }

        const tierMap: { [key: string]: number } = {
          'Bronze': 0,
          'Silver': 1, 
          'Gold': 2,
          'Platinum': 3
        };

        if (!(tier in tierMap)) {
          return NextResponse.json(
            { error: 'Invalid tier. Must be Bronze, Silver, Gold, or Platinum' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Mint transaction data prepared',
          transactionData: {
            to: contractInfo.address,
            data: contract.interface.encodeFunctionData('mintReputationNFT', [
              contributionScore,
              tierMap[tier]
            ])
          }
        });

      case 'updateScore':
        const { tokenId, newScore } = actionData;
        
        if (!tokenId || typeof newScore !== 'number' || newScore < 0) {
          return NextResponse.json(
            { error: 'Invalid token ID or score' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Update score transaction data prepared',
          transactionData: {
            to: contractInfo.address,
            data: contract.interface.encodeFunctionData('updateContributionScore', [
              tokenId,
              newScore
            ])
          }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Error processing reputation action:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process action',
        details: error.message
      },
      { status: 500 }
    );
  }
}
