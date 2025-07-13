import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { bscTestnet } from 'viem/chains';
import CarvIdPostVotingABI from '@/lib/CarvIdPostVoting_ABI.json';
import carvIdAbiData from '@/lib/ModularCarvID_ABI.json';

const CONTRACT_ADDRESS = '0x57cDDc41cCF33099D695BEE8A0879da9d57924B9';
const CARV_ID_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x59C3fed3153866A139e8efBA185da2BD083fF034") as `0x${string}`;
const carvIdAbi = carvIdAbiData.abi; // Use just the ABI array

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
});

// Debug environment variable
console.log('🔍 PostVoting API - Environment variable check:', {
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  CARV_ID_CONTRACT_ADDRESS,
  hasEnvVar: !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
});

// Hardcoded posts data
const HARDCODED_POSTS = [
  {
    id: 1,
    title: "Welcome to MustaFair!",
    content: "Welcome to our decentralized social media platform. Here you can share your thoughts, connect with others, and build your reputation through Web3 identity.",
    author: "MustaFair Team",
    timestamp: Date.now() - 86400000, // 1 day ago
    category: "Announcement"
  },
  {
    id: 2,
    title: "The Future of Social Media",
    content: "Decentralized social media represents the next evolution in online communication. By combining Web2 achievements with Web3 identity, we're creating a more transparent and user-controlled platform.",
    author: "Web3 Enthusiast",
    timestamp: Date.now() - 172800000, // 2 days ago
    category: "Technology"
  },
  {
    id: 3,
    title: "Building Reputation Through NFTs",
    content: "Your reputation on MustaFair is tied to your NFT identity. This creates a unique system where your achievements and contributions are permanently recorded on the blockchain.",
    author: "NFT Creator",
    timestamp: Date.now() - 259200000, // 3 days ago
    category: "Blockchain"
  },
  {
    id: 4,
    title: "Community Guidelines",
    content: "We believe in fostering a positive and constructive community. Please respect others, share valuable content, and contribute meaningfully to discussions.",
    author: "Community Manager",
    timestamp: Date.now() - 345600000, // 4 days ago
    category: "Community"
  },
  {
    id: 5,
    title: "Getting Started with CARV ID",
    content: "To participate in voting and access premium features, you'll need a CARV ID. This decentralized identity system ensures secure and verifiable user authentication.",
    author: "CARV ID Guide",
    timestamp: Date.now() - 432000000, // 5 days ago
    category: "Tutorial"
  }
];

export async function GET() {
  try {
    console.log('🔧 PostVoting API - ABI Validation Debug:', {
      abiLength: carvIdAbi.length,
      hasWalletToTokenId: carvIdAbi.some((item: any) => 
        typeof item === 'object' && item.name === 'walletToTokenId'
      ),
      hasTokenURI: carvIdAbi.some((item: any) => 
        typeof item === 'object' && item.name === 'tokenURI'
      ),
      // Show sample of ABI functions
      abiFunctions: carvIdAbi
        .filter((item: any) => typeof item === 'object' && item.type === 'function')
        .slice(0, 10)
        .map((item: any) => item.name)
    });
    
    console.log('ABI type:', typeof CarvIdPostVotingABI);
    console.log('ABI length:', Array.isArray(CarvIdPostVotingABI) ? CarvIdPostVotingABI.length : 'Not an array');
    
    // Get on-chain post data
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CarvIdPostVotingABI,
      functionName: 'getAllPosts',
    });
    
    console.log('Contract result:', result);
    
    const [postIds, isActive, likes, dislikes, totalVotes] = result as [bigint[], boolean[], bigint[], bigint[], bigint[]];

    // Combine hardcoded posts with on-chain data
    const posts = HARDCODED_POSTS.map((post, index) => ({
      ...post,
      onChainData: {
        postId: Number(postIds[index]),
        isActive: isActive[index],
        likes: Number(likes[index]),
        dislikes: Number(dislikes[index]),
        totalVotes: Number(totalVotes[index])
      }
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('❌ PostVoting API - Error fetching posts:', error);
    
    // Fallback: return posts with default on-chain data
    const fallbackPosts = HARDCODED_POSTS.map((post) => ({
      ...post,
      onChainData: {
        postId: post.id,
        isActive: true,
        likes: 0,
        dislikes: 0,
        totalVotes: 0
      }
    }));
    
    return NextResponse.json({ posts: fallbackPosts });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postId, isLike, userAddress } = await request.json();

    console.log('🎯 PostVoting API - Vote request received:', { postId, isLike, userAddress });

    if (!postId || typeof isLike !== 'boolean' || !userAddress) {
      console.error('❌ PostVoting API - Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if user has CARV ID
    try {
      console.log('🔍 PostVoting API - Checking CARV ID for address:', userAddress);
      console.log('🔍 PostVoting API - Using contract address:', CARV_ID_CONTRACT_ADDRESS);
      
      // Check CARV ID ownership using the ModularCarvID contract
      const tokenId = await publicClient.readContract({
        address: CARV_ID_CONTRACT_ADDRESS,
        abi: carvIdAbi,
        functionName: 'walletToTokenId',
        args: [userAddress as `0x${string}`],
      });

      console.log('🔍 PostVoting API - CARV ID check result:', {
        userAddress,
        tokenId: tokenId ? String(tokenId) : null,
        hasCarvId: tokenId && Number(tokenId) > 0
      });

      // User has CARV ID if tokenId is greater than 0
      const hasCarvId = tokenId && Number(tokenId) > 0;

      if (!hasCarvId) {
        console.error('❌ PostVoting API - User does not have CARV ID');
        return NextResponse.json(
          { error: 'User must have CARV ID to vote' },
          { status: 403 }
        );
      }

      console.log('✅ PostVoting API - CARV ID verification successful');
    } catch (error) {
      console.error('❌ PostVoting API - Error checking CARV ID:', error);
      return NextResponse.json(
        { error: 'Failed to verify CARV ID status' },
        { status: 500 }
      );
    }

    // Check if user has already voted
    try {
      const hasVoted = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CarvIdPostVotingABI,
        functionName: 'hasUserVoted',
        args: [BigInt(postId), userAddress as `0x${string}`],
      });

      console.log('🔍 PostVoting API - Vote check result:', { hasVoted });

      if (hasVoted) {
        console.error('❌ PostVoting API - User has already voted');
        return NextResponse.json(
          { error: 'User has already voted on this post' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('❌ PostVoting API - Error checking vote status:', error);
      // Continue with validation even if vote check fails
    }

    // Get post status
    try {
      const postResult = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CarvIdPostVotingABI,
        functionName: 'getPost',
        args: [BigInt(postId)],
      });

      console.log('🔍 PostVoting API - Post result:', postResult);
      console.log('🔍 PostVoting API - Post result type:', typeof postResult);
      console.log('🔍 PostVoting API - Post result length:', Array.isArray(postResult) ? postResult.length : 'Not an array');

      const post = postResult as [bigint, boolean, bigint, bigint, bigint];
      const [id, isActive, likes, dislikes, totalVotes] = post;

      console.log('✅ PostVoting API - Parsed post data:', { 
        id: Number(id), 
        isActive, 
        likes: Number(likes), 
        dislikes: Number(dislikes), 
        totalVotes: Number(totalVotes) 
      });

      if (!isActive) {
        console.error('❌ PostVoting API - Post is not active');
        return NextResponse.json(
          { error: 'Post is not active' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('❌ PostVoting API - Error getting post status:', error);
      // Continue with validation even if post status check fails
    }

    // Return success - the actual voting will be done on the frontend
    console.log('✅ PostVoting API - Vote validation successful');
    return NextResponse.json({ 
      success: true,
      message: 'Vote validated successfully. Please confirm the transaction on your wallet.'
    });

  } catch (error) {
    console.error('❌ PostVoting API - Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 