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
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const postIdNum = parseInt(postId);
    
    if (isNaN(postIdNum) || postIdNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
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
      const postVoteData = await contract.getPostVote(postIdNum);
      const [votesFor, votesAgainst, votingDeadline, isExecuted] = postVoteData;
      
      // Get current time to check if voting is still active
      const currentTime = Math.floor(Date.now() / 1000);
      const isVotingActive = currentTime <= Number(votingDeadline) && !isExecuted;
      
      // Calculate if post is passing
      const totalVotes = Number(votesFor) + Number(votesAgainst);
      const isPassing = Number(votesFor) > Number(votesAgainst) && Number(votesFor) >= 3; // MIN_VOTES_REQUIRED
      
      const response = {
        success: true,
        data: {
          postId: postIdNum,
          votesFor: Number(votesFor),
          votesAgainst: Number(votesAgainst),
          totalVotes,
          votingDeadline: new Date(Number(votingDeadline) * 1000).toISOString(),
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
      if (contractError.reason && contractError.reason.includes('Invalid post')) {
        return NextResponse.json({
          success: false,
          error: 'Post not found'
        }, { status: 404 });
      }
      
      throw contractError;
    }

  } catch (error: any) {
    console.error('Error fetching post vote data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch post vote data',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const body = await request.json();
    const { action, ...actionData } = body;

    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum) || postIdNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
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
      case 'vote':
        const { support, voterAddress } = actionData;
        
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
            data: contract.interface.encodeFunctionData('voteOnPost', [
              postIdNum,
              support
            ])
          }
        });

      case 'execute':
        return NextResponse.json({
          success: true,
          message: 'Execute post transaction data prepared',
          transactionData: {
            to: contractInfo.address,
            data: contract.interface.encodeFunctionData('executePost', [
              postIdNum
            ])
          }
        });

      case 'create':
        const { votingDeadline } = actionData;
        
        if (!votingDeadline || isNaN(parseInt(votingDeadline))) {
          return NextResponse.json(
            { error: 'Invalid voting deadline' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Create post transaction data prepared',
          transactionData: {
            to: contractInfo.address,
            data: contract.interface.encodeFunctionData('createPost', [
              parseInt(votingDeadline)
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
    console.error('Error processing post voting action:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process post voting action',
        details: error.message
      },
      { status: 500 }
    );
  }
} 