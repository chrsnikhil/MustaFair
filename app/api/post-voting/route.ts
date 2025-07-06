import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { bscTestnet } from 'viem/chains';
import CarvIdPostVotingABI from '@/lib/CarvIdPostVoting_ABI.json';

const CONTRACT_ADDRESS = '0x57cDDc41cCF33099D695BEE8A0879da9d57924B9';

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
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
    console.error('Error fetching posts:', error);
    
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

    if (!postId || typeof isLike !== 'boolean' || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if user has CARV ID
    try {
      const hasCarvId = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CarvIdPostVotingABI,
        functionName: 'hasUserCarvId',
        args: [userAddress as `0x${string}`],
      });

      if (!hasCarvId) {
        return NextResponse.json(
          { error: 'User must have CARV ID to vote' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error checking CARV ID:', error);
      return NextResponse.json(
        { error: 'Failed to verify CARV ID status' },
        { status: 500 }
      );
    }

    // Check if user has already voted
    const hasVoted = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CarvIdPostVotingABI,
      functionName: 'hasUserVoted',
      args: [BigInt(postId), userAddress as `0x${string}`],
    });

    if (hasVoted) {
      return NextResponse.json(
        { error: 'User has already voted on this post' },
        { status: 400 }
      );
    }

    // Get post status
    const postResult = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CarvIdPostVotingABI,
      functionName: 'getPost',
      args: [BigInt(postId)],
    });

    console.log('Post result:', postResult);
    console.log('Post result type:', typeof postResult);
    console.log('Post result length:', Array.isArray(postResult) ? postResult.length : 'Not an array');

    const post = postResult as [bigint, boolean, bigint, bigint, bigint];
    const [id, isActive, likes, dislikes, totalVotes] = post;

    console.log('Parsed post data:', { id: Number(id), isActive, likes: Number(likes), dislikes: Number(dislikes), totalVotes: Number(totalVotes) });

    if (!isActive) {
      return NextResponse.json(
        { error: 'Post is not active' },
        { status: 400 }
      );
    }

    // Return success - the actual voting will be done on the frontend
    return NextResponse.json({ 
      success: true,
      message: 'Vote validated successfully. Please confirm the transaction on your wallet.'
    });

  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 