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
  { params }: { params: { proposalId: string } }
) {
  try {
    const { proposalId } = params;
    const proposalIdNum = parseInt(proposalId);
    
    if (isNaN(proposalIdNum) || proposalIdNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid proposal ID' },
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

    try {
      const proposalData = await contract.getProposal(proposalIdNum);
      const [tokenId, proposedTier, votesFor, votesAgainst, proposalDeadline, isExecuted] = proposalData;
      
      const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      const proposedTierName = tierNames[Number(proposedTier)];
      
      // Get current time to check if voting is still active
      const currentTime = Math.floor(Date.now() / 1000);
      const isVotingActive = currentTime <= Number(proposalDeadline) && !isExecuted;
      
      // Calculate if proposal is passing
      const totalVotes = Number(votesFor) + Number(votesAgainst);
      const isPassing = Number(votesFor) > Number(votesAgainst) && Number(votesFor) >= 3; // MIN_VOTES_REQUIRED
      
      const response = {
        success: true,
        data: {
          proposalId: proposalIdNum,
          tokenId: tokenId.toString(),
          proposedTier: proposedTierName,
          proposedTierLevel: Number(proposedTier),
          votesFor: Number(votesFor),
          votesAgainst: Number(votesAgainst),
          totalVotes,
          proposalDeadline: new Date(Number(proposalDeadline) * 1000).toISOString(),
          isExecuted,
          isVotingActive,
          isPassing,
          canExecute: !isVotingActive && !isExecuted && isPassing,
          contractAddress: contractInfo.address,
          network: 'BNB Testnet',
          chainId: 97
        }
      };

      return NextResponse.json(response);
      
    } catch (contractError: any) {
      if (contractError.reason && contractError.reason.includes('Invalid proposal')) {
        return NextResponse.json({
          success: false,
          error: 'Proposal not found'
        }, { status: 404 });
      }
      
      throw contractError;
    }

  } catch (error: any) {
    console.error('Error fetching proposal data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch proposal data',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { proposalId: string } }
) {
  try {
    const { proposalId } = params;
    const body = await request.json();
    const { action, ...actionData } = body;

    // For creating proposals, we don't need a valid proposal ID
    if (action !== 'create') {
      const proposalIdNum = parseInt(proposalId);
      if (isNaN(proposalIdNum) || proposalIdNum <= 0) {
        return NextResponse.json(
          { error: 'Invalid proposal ID' },
          { status: 400 }
        );
      }
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
      case 'vote':
        const proposalIdNum = parseInt(proposalId);
        const { support, reason = '', voterAddress } = actionData;
        
        if (typeof support !== 'boolean') {
          return NextResponse.json(
            { error: 'Support must be true or false' },
            { status: 400 }
          );
        }

        if (!ethers.isAddress(voterAddress)) {
          return NextResponse.json(
            { error: 'Invalid voter address' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Vote transaction data prepared',
          transactionData: {
            to: contractInfo.address,
            data: contract.interface.encodeFunctionData('voteOnTierUpgrade', [
              parseInt(proposalId),
              support,
              reason
            ])
          }
        });

      case 'execute':
        return NextResponse.json({
          success: true,
          message: 'Execute proposal transaction data prepared',
          transactionData: {
            to: contractInfo.address,
            data: contract.interface.encodeFunctionData('executeTierUpgrade', [
              parseInt(proposalId)
            ])
          }
        });

      case 'create':
        const { tokenId, proposedTier } = actionData;
        
        if (!tokenId || isNaN(parseInt(tokenId))) {
          return NextResponse.json(
            { error: 'Invalid token ID' },
            { status: 400 }
          );
        }

        const tierMap: { [key: string]: number } = {
          'Bronze': 0,
          'Silver': 1, 
          'Gold': 2,
          'Platinum': 3
        };

        if (!(proposedTier in tierMap)) {
          return NextResponse.json(
            { error: 'Invalid tier. Must be Bronze, Silver, Gold, or Platinum' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Create proposal transaction data prepared',
          transactionData: {
            to: contractInfo.address,
            data: contract.interface.encodeFunctionData('proposeTierUpgrade', [
              parseInt(tokenId),
              tierMap[proposedTier]
            ])
          }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: vote, execute, or create' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Error processing voting action:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process voting action',
        details: error.message
      },
      { status: 500 }
    );
  }
}
