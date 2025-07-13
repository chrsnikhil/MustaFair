'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import CarvIdPostVotingABI from '@/lib/CarvIdPostVoting_ABI.json';
import carvIdAbiData from '@/lib/ModularCarvID_ABI.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Clock, User, Tag, Terminal, HardDrive, Cpu, Settings, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { bscTestnet, localhost } from 'wagmi/chains';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x57cDDc41cCF33099D695BEE8A0879da9d57924B9';
const CARV_ID_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x59C3fed3153866A139e8efBA185da2BD083fF034") as `0x${string}`;
const carvIdAbi = carvIdAbiData.abi; // Use just the ABI array

// Debug environment variable
console.log('🔍 PostVoting - Environment variable check:', {
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  CARV_ID_CONTRACT_ADDRESS,
  hasEnvVar: !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
});

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  category: string;
  onChainData: {
    postId: number;
    isActive: boolean;
    likes: number;
    dislikes: number;
    totalVotes: number;
  };
}

export default function PostVoting() {
  const { address, isConnected, chain } = useAccount();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<{ [key: number]: boolean }>({});
  const [hasCarvId, setHasCarvId] = useState<boolean | null>(null);

  // Check if user is on correct network
  const isOnCorrectNetwork = chain?.id === bscTestnet.id || chain?.id === localhost.id;

  // Contract write for voting
  const { writeContract, data: voteData, isPending: isVoteLoading } = useWriteContract();

  const { isLoading: isReceiptLoading, isSuccess: isVoteSuccess } = useWaitForTransactionReceipt({
    hash: voteData,
  });

  // Enhanced CARV ID detection using the same logic as carv-id-viewer
  const { data: carvIdTokenId, isLoading: isCheckingCarvId, error: carvIdError } = useReadContract({
    address: CARV_ID_CONTRACT_ADDRESS,
    abi: carvIdAbi,
    functionName: 'walletToTokenId',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && isOnCorrectNetwork && !!address,
    },
  });

  // Enhanced debugging for CARV ID detection
  useEffect(() => {
    if (isConnected && isOnCorrectNetwork && address) {
      console.log('🔍 PostVoting CARV ID Detection Debug:', {
        address,
        contractAddress: CARV_ID_CONTRACT_ADDRESS,
        functionName: 'walletToTokenId',
        args: [address],
        enabled: isConnected && isOnCorrectNetwork && !!address,
        network: chain?.id === localhost.id ? 'Localhost' : 'BNB Testnet',
        chainId: chain?.id,
        tokenId: carvIdTokenId ? String(carvIdTokenId) : null,
        hasCarvId: carvIdTokenId !== undefined && carvIdTokenId !== null && Number(carvIdTokenId) > 0,
        carvIdError
      });
      
      // Check if contract is deployed
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        provider.getCode(CARV_ID_CONTRACT_ADDRESS).then((code: string) => {
          console.log('📋 PostVoting Contract Deployment Check:', {
            contractAddress: CARV_ID_CONTRACT_ADDRESS,
            hasCode: code !== '0x',
            codeLength: code.length,
            isDeployed: code !== '0x'
          });
        }).catch((error: any) => {
          console.error('❌ PostVoting Contract deployment check failed:', error);
        });
      }
    }
  }, [isConnected, isOnCorrectNetwork, address, CARV_ID_CONTRACT_ADDRESS, chain, carvIdTokenId, carvIdError]);

  // ABI validation debugging
  useEffect(() => {
    console.log('🔧 PostVoting ABI Validation Debug:', {
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
  }, []);

  // Update CARV ID status when token ID is available
  useEffect(() => {
    console.log('🔍 PostVoting CARV ID detection debug:', {
      address,
      contractAddress: CARV_ID_CONTRACT_ADDRESS,
      chainId: chain?.id,
      isOnCorrectNetwork,
      isConnected,
      carvIdTokenId,
      carvIdError,
      hasCarvId: carvIdTokenId !== undefined && carvIdTokenId !== null && Number(carvIdTokenId) > 0,
      envVar: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    });
    
    if (carvIdTokenId !== undefined) {
      const hasToken = carvIdTokenId !== null && Number(carvIdTokenId) > 0;
      setHasCarvId(hasToken);
      console.log('✅ PostVoting CARV ID check:', { 
        address, 
        tokenId: carvIdTokenId, 
        hasToken, 
        chainId: chain?.id, 
        isOnCorrectNetwork 
      });
    }
  }, [carvIdTokenId, address, chain, carvIdError]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (isVoteSuccess) {
      toast.success('Vote recorded successfully!');
      fetchPosts(); // Refresh posts to get updated vote counts
    }
  }, [isVoteSuccess]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/post-voting');
      const data = await response.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: number, isLike: boolean) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check if user has CARV ID
    if (hasCarvId === false) {
      toast.error('You need a CARV ID to vote on posts. Please mint a CARV ID first.');
      return;
    }

    // Show loading if still checking CARV ID
    if (hasCarvId === null && isCheckingCarvId) {
      toast.error('Checking CARV ID status... Please wait.');
      return;
    }

    console.log('🎯 PostVoting - Attempting to vote:', { 
      postId, 
      isLike, 
      address, 
      hasCarvId,
      tokenId: carvIdTokenId ? String(carvIdTokenId) : null
    });

    setVoting(prev => ({ ...prev, [postId]: true }));

    try {
      // First validate the vote with the API
      const response = await fetch('/api/post-voting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          isLike,
          userAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ PostVoting - Vote validation failed:', data.error);
        toast.error(data.error || 'Failed to validate vote');
        return;
      }

      console.log('✅ PostVoting - Vote validation successful:', data);

      // If validation passes, execute the on-chain vote
      try {
        writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CarvIdPostVotingABI,
          functionName: 'voteOnPost',
          args: [BigInt(postId), isLike],
        });
        console.log('🚀 PostVoting - Vote transaction submitted');
      } catch (contractError) {
        console.error('❌ PostVoting - Contract write error:', contractError);
        toast.error('Failed to submit vote transaction');
      }

    } catch (error) {
      console.error('❌ PostVoting - Error voting:', error);
      toast.error('Failed to vote');
    } finally {
      setVoting(prev => ({ ...prev, [postId]: false }));
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'JUST NOW';
    if (diffInHours < 24) return `${diffInHours}H AGO`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}D AGO`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative p-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#222_49%,#222_50%,transparent_52%)] opacity-40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center py-32">
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-32 h-32 bg-black border-4 border-white mx-auto flex items-center justify-center shadow-[16px_16px_0px_0px_#666] mb-8"
            >
              <Settings className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-4xl font-black font-mono text-white tracking-[0.2em] transform -skew-x-1">
              LOADING POSTS...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative p-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#222_49%,#222_50%,transparent_52%)] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h1
            className="text-7xl font-black text-white font-mono tracking-[0.2em] mb-4 transform -skew-x-1"
            style={{ textShadow: "4px 4px 0px #666, 8px 8px 0px #999" }}
          >
            COMMUNITY POSTS
            <br />
            <span className="text-5xl tracking-[0.3em] text-[#d1d5db]">VOTING SYSTEM</span>
          </h1>
          <div className="bg-white text-black px-8 py-3 inline-block transform skew-x-1 border-4 border-white shadow-[6px_6px_0px_0px_#666] font-mono font-black tracking-[0.2em]">
            CARV ID REQUIRED • ON-CHAIN VOTING • DECENTRALIZED
          </div>
          
          {/* CARV ID Status Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            {!isConnected ? (
              <div className="bg-black border-4 border-white shadow-[8px_8px_0px_0px_#666] transform -skew-x-1 p-6">
                <div className="flex items-center justify-center gap-4 transform skew-x-1">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <span className="font-black font-mono text-white tracking-[0.2em] text-lg">CONNECT WALLET TO VOTE</span>
                </div>
              </div>
            ) : !isOnCorrectNetwork ? (
              <div className="bg-black border-4 border-yellow-500 shadow-[8px_8px_0px_0px_#666] transform -skew-x-1 p-6">
                <div className="flex items-center justify-center gap-4 transform skew-x-1">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <span className="font-black font-mono text-yellow-400 tracking-[0.2em] text-lg">SWITCH TO BNB TESTNET/LOCALHOST</span>
                </div>
              </div>
            ) : isCheckingCarvId ? (
              <div className="bg-black border-4 border-white shadow-[8px_8px_0px_0px_#666] transform -skew-x-1 p-6">
                <div className="flex items-center justify-center gap-4 transform skew-x-1">
                  <Settings className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="font-black font-mono text-white tracking-[0.2em] text-lg">CHECKING CARV ID STATUS...</span>
                </div>
              </div>
            ) : hasCarvId ? (
              <div className="bg-white border-4 border-white shadow-[8px_8px_0px_0px_#666] transform -skew-x-1 p-6">
                <div className="flex items-center justify-center gap-4 transform skew-x-1">
                  <Shield className="w-6 h-6 text-black" />
                  <span className="font-black font-mono text-black tracking-[0.2em] text-lg">CARV ID VERIFIED • READY TO VOTE</span>
                </div>
              </div>
            ) : (
              <div className="bg-black border-4 border-red-500 shadow-[8px_8px_0px_0px_#666] transform -skew-x-1 p-6">
                <div className="flex items-center justify-center gap-4 transform skew-x-1">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <span className="font-black font-mono text-red-400 tracking-[0.2em] text-lg">CARV ID REQUIRED • MINT TO VOTE</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="h-full"
            >
              <Card className="bg-black border-4 border-white shadow-[16px_16px_0px_0px_#666] hover:shadow-[20px_20px_0px_0px_#666] transition-all duration-400 group h-full flex flex-col">
                <CardHeader className="relative flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 mb-4 line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-[#d1d5db] font-mono mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="tracking-wider">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="tracking-wider">{formatTimestamp(post.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#d1d5db]" />
                        <Badge className="bg-white text-black font-bold font-mono px-3 py-1 border-2 border-white shadow-[3px_3px_0px_0px_#666] tracking-wider transform skew-x-1">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    {!post.onChainData.isActive && (
                      <Badge className="bg-black border-2 border-white text-white font-bold font-mono px-3 py-1 shadow-[3px_3px_0px_0px_#666] tracking-wider transform -skew-x-1">
                        INACTIVE
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white transform rotate-45 opacity-20"></div>
                </CardHeader>
                
                <CardContent className="space-y-6 flex-1 flex flex-col">
                  <CardDescription className="text-[#d1d5db] font-mono font-medium tracking-wide leading-relaxed flex-1 line-clamp-4">
                    {post.content}
                  </CardDescription>

                  <div className="space-y-4 mt-auto">
                    <div className="flex items-center justify-between text-sm text-[#d1d5db] font-mono">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5 text-green-400" />
                          <span className="font-bold tracking-wider">{post.onChainData.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="w-5 h-5 text-red-400" />
                          <span className="font-bold tracking-wider">{post.onChainData.dislikes}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#999] tracking-[0.2em]">
                        {post.onChainData.totalVotes} TOTAL VOTES
                      </div>
                    </div>

                    {post.onChainData.isActive && (
                      <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            className={`font-black font-mono px-6 py-3 border-4 transition-all duration-300 tracking-wider transform -skew-x-1 flex-1 ${
                              hasCarvId && isConnected && isOnCorrectNetwork
                                ? 'bg-white hover:bg-[#e8e8e8] text-black border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666]'
                                : 'bg-[#666] text-[#999] border-[#666] cursor-not-allowed'
                            }`}
                            onClick={() => handleVote(post.id, true)}
                            disabled={voting[post.id] || isVoteLoading || !hasCarvId || !isConnected || !isOnCorrectNetwork}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {!isConnected ? 'CONNECT WALLET' : !isOnCorrectNetwork ? 'WRONG NETWORK' : !hasCarvId ? 'NEED CARV ID' : 'LIKE'}
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            className={`font-black font-mono px-6 py-3 border-4 transition-all duration-300 tracking-wider transform skew-x-1 flex-1 ${
                              hasCarvId && isConnected && isOnCorrectNetwork
                                ? 'bg-black border-white text-white hover:bg-[#1a1a1a] shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666]'
                                : 'bg-[#666] text-[#999] border-[#666] cursor-not-allowed'
                            }`}
                            onClick={() => handleVote(post.id, false)}
                            disabled={voting[post.id] || isVoteLoading || !hasCarvId || !isConnected || !isOnCorrectNetwork}
                          >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            {!isConnected ? 'CONNECT WALLET' : !isOnCorrectNetwork ? 'WRONG NETWORK' : !hasCarvId ? 'NEED CARV ID' : 'DISLIKE'}
                          </Button>
                        </motion.div>
                      </div>
                    )}

                    {!post.onChainData.isActive && (
                      <div className="text-center text-sm text-[#666] font-mono tracking-wider border-2 border-[#333] p-4">
                        THIS POST IS CURRENTLY INACTIVE
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center py-32"
          >
            <div className="w-32 h-32 bg-black border-4 border-white mx-auto flex items-center justify-center shadow-[16px_16px_0px_0px_#666] mb-8">
              <Terminal className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-black font-mono text-white tracking-[0.2em] transform -skew-x-1 mb-4">
              NO POSTS AVAILABLE
            </h2>
            <p className="text-[#d1d5db] font-mono tracking-wide">
              CHECK BACK LATER FOR NEW COMMUNITY CONTENT
            </p>
          </motion.div>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center py-8"
          >
            <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] max-w-md mx-auto">
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 bg-black border-4 border-white mx-auto flex items-center justify-center shadow-[6px_6px_0px_0px_#666]">
                  <HardDrive className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black font-mono text-white tracking-wider">
                  WALLET NOT CONNECTED
                </h3>
                <p className="text-[#d1d5db] font-mono tracking-wide">
                  CONNECT YOUR WALLET TO PARTICIPATE IN VOTING
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
} 