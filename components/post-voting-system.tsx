"use client"

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Vote, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

// Hardcoded posts for the voting system
const HARDCODED_POSTS = [
  {
    id: 1,
    title: "Proposal: Implement Cross-Chain Identity Verification",
    content: "We propose implementing a cross-chain identity verification system that allows users to link their identities across multiple blockchains. This would enhance the interoperability of our reputation system and enable seamless identity portability.",
    author: "0x7a8b9c...",
    category: "Technical",
    timestamp: "2024-01-15T10:30:00Z",
    tags: ["identity", "cross-chain", "verification"]
  },
  {
    id: 2,
    title: "Governance: Community-Driven Tier System Updates",
    content: "Proposal to update the tier system to include community-driven criteria. This would allow the community to vote on new tier requirements and adjust scoring mechanisms based on collective feedback.",
    author: "0x3f4e5d...",
    category: "Governance",
    timestamp: "2024-01-14T15:45:00Z",
    tags: ["governance", "tiers", "community"]
  },
  {
    id: 3,
    title: "Feature: AI-Powered Reputation Analytics",
    content: "Integration of AI-powered analytics to provide users with detailed insights into their reputation metrics. This would include trend analysis, comparison tools, and predictive scoring.",
    author: "0x1a2b3c...",
    category: "Feature",
    timestamp: "2024-01-13T09:20:00Z",
    tags: ["AI", "analytics", "reputation"]
  },
  {
    id: 4,
    title: "Security: Enhanced Privacy Controls",
    content: "Implementation of enhanced privacy controls allowing users to selectively disclose reputation data. This would include granular permissions and zero-knowledge proof integration.",
    author: "0x9d8e7f...",
    category: "Security",
    timestamp: "2024-01-12T14:15:00Z",
    tags: ["privacy", "security", "zero-knowledge"]
  },
  {
    id: 5,
    title: "Integration: DeFi Protocol Partnerships",
    content: "Proposal to establish partnerships with major DeFi protocols for reputation-based lending and governance participation. This would expand the utility of reputation tokens.",
    author: "0x5e6f7g...",
    category: "Integration",
    timestamp: "2024-01-11T11:30:00Z",
    tags: ["DeFi", "partnerships", "lending"]
  }
];

interface PostVoteData {
  postId: number;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  votingDeadline: string;
  isExecuted: boolean;
  isVotingActive: boolean;
  isPassing: boolean;
  canExecute: boolean;
  userVote?: boolean;
  userHasVoted: boolean;
}

interface ReputationData {
  tokenId: string | null;
  tier: string;
  contributionScore: string;
  isActive: boolean;
}

export default function PostVotingSystem() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [voteSupport, setVoteSupport] = useState<boolean>(true);
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [postVotes, setPostVotes] = useState<{ [key: number]: PostVoteData }>({});

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Initialize post votes with existing proposal data (using proposal ID 1)
  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        const response = await fetch('/api/voting/1');
        const result = await response.json();
        
        if (result.success && result.data) {
          const proposalData = result.data;
          
          // Map proposal data to post vote data
          const initialVotes: { [key: number]: PostVoteData } = {};
          HARDCODED_POSTS.forEach(post => {
            initialVotes[post.id] = {
              postId: post.id,
              votesFor: proposalData.votesFor || 0,
              votesAgainst: proposalData.votesAgainst || 0,
              totalVotes: (proposalData.votesFor || 0) + (proposalData.votesAgainst || 0),
              votingDeadline: proposalData.proposalDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              isExecuted: proposalData.isExecuted || false,
              isVotingActive: proposalData.isVotingActive || true,
              isPassing: proposalData.isPassing || false,
              canExecute: proposalData.canExecute || false,
              userHasVoted: false
            };
          });
          
          setPostVotes(initialVotes);
        }
      } catch (error) {
        console.error('Error fetching proposal data:', error);
        // Fallback to mock data if API fails
        const initialVotes: { [key: number]: PostVoteData } = {};
        HARDCODED_POSTS.forEach(post => {
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + 7);
          
          initialVotes[post.id] = {
            postId: post.id,
            votesFor: Math.floor(Math.random() * 50) + 10,
            votesAgainst: Math.floor(Math.random() * 30) + 5,
            totalVotes: 0,
            votingDeadline: deadline.toISOString(),
            isExecuted: false,
            isVotingActive: true,
            isPassing: false,
            canExecute: false,
            userHasVoted: false
          };
          
          initialVotes[post.id].totalVotes = initialVotes[post.id].votesFor + initialVotes[post.id].votesAgainst;
          initialVotes[post.id].isPassing = initialVotes[post.id].votesFor > initialVotes[post.id].votesAgainst && initialVotes[post.id].votesFor >= 3;
          initialVotes[post.id].canExecute = !initialVotes[post.id].isVotingActive && !initialVotes[post.id].isExecuted && initialVotes[post.id].isPassing;
        });
        
        setPostVotes(initialVotes);
      }
    };

    fetchProposalData();
  }, []);

  // Fetch user's reputation data
  const fetchReputationData = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`/api/reputation-nft/${address}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setReputationData(result.data);
      }
    } catch (error) {
      console.error('Error fetching reputation data:', error);
    }
  };

  // Create proposal if it doesn't exist
  const createProposalIfNeeded = async () => {
    if (!address) return;
    
    try {
      // Check if proposal 1 exists by trying to fetch it
      const response = await fetch('/api/voting/1');
      const result = await response.json();
      
      if (!result.success && result.error === 'Proposal not found') {
        // Create proposal 1
        const createResponse = await fetch('/api/voting/1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            tokenId: '1', // Use token ID 1
            proposedTier: 'Gold' // Propose upgrade to Gold tier
          })
        });

        const createResult = await createResponse.json();
        
        if (createResult.success) {
          writeContract({
            address: createResult.transactionData.to as `0x${string}`,
            abi: [
              {
                name: 'proposeTierUpgrade',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [
                  { name: 'tokenId', type: 'uint256' },
                  { name: 'proposedTier', type: 'uint8' }
                ],
                outputs: []
              }
            ],
            functionName: 'proposeTierUpgrade',
            args: [BigInt(1), 2] // Token ID 1, Gold tier (2)
          });
        }
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  // Check if user has voted on proposal 1
  const checkUserVote = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`/api/voting/1`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // For now, we'll assume user hasn't voted if they can vote
        // In a real implementation, you'd check the blockchain directly
        setPostVotes(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(postId => {
            updated[parseInt(postId)] = {
              ...updated[parseInt(postId)],
              userHasVoted: false // This would be checked from blockchain
            };
          });
          return updated;
        });
      }
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchReputationData();
      createProposalIfNeeded();
      checkUserVote();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction successful!');
      if (selectedPost) {
        // Refresh post vote data from proposal
        const refreshProposalData = async () => {
          try {
            const response = await fetch('/api/voting/1');
            const result = await response.json();
            
            if (result.success && result.data) {
              const proposalData = result.data;
              
              setPostVotes(prev => ({
                ...prev,
                [selectedPost]: {
                  ...prev[selectedPost],
                  votesFor: proposalData.votesFor || prev[selectedPost].votesFor,
                  votesAgainst: proposalData.votesAgainst || prev[selectedPost].votesAgainst,
                  totalVotes: (proposalData.votesFor || 0) + (proposalData.votesAgainst || 0),
                  isExecuted: proposalData.isExecuted || false,
                  isVotingActive: proposalData.isVotingActive || true,
                  isPassing: proposalData.isPassing || false,
                  canExecute: proposalData.canExecute || false,
                  userHasVoted: true,
                  userVote: voteSupport
                }
              }));
            }
          } catch (error) {
            console.error('Error refreshing proposal data:', error);
          }
        };
        
        refreshProposalData();
      }
      fetchReputationData();
    }
  }, [isSuccess]);

  // Estimate gas cost for voting
  const estimateGasCost = async () => {
    if (!address) return;
    
    try {
      const response = await fetch('/api/voting/1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          support: true,
          reason: '', // Empty string for minimal gas
          voterAddress: address
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // This would be the actual gas estimation
        console.log('Vote transaction prepared:', result.transactionData);
        return 'Transaction ready - Gas cost will be shown by wallet';
      }
    } catch (error) {
      console.error('Error estimating gas:', error);
    }
  };

  const handleVote = async (postId: number) => {
    if (!address || !selectedPost) {
      toast.error('Invalid voting parameters');
      return;
    }

    setLoading(true);
    try {
      // Use the existing voting API with proposal ID 1 (treating it as post voting)
      const response = await fetch(`/api/voting/1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          support: voteSupport,
          reason: '', // Empty string to minimize gas costs
          voterAddress: address
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to prepare transaction');
      }

      writeContract({
        address: result.transactionData.to as `0x${string}`,
        abi: [
          {
            name: 'voteOnTierUpgrade',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'proposalId', type: 'uint256' },
              { name: 'support', type: 'bool' },
              { name: 'reason', type: 'string' }
            ],
            outputs: []
          }
        ],
        functionName: 'voteOnTierUpgrade',
        args: [BigInt(1), voteSupport, ''] // Use proposal ID 1, empty reason
      });

    } catch (error: any) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const handleExecutePost = async (postId: number) => {
    if (!address) {
      toast.error('Invalid execution parameters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/voting/1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'execute' })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to prepare transaction');
      }

      writeContract({
        address: result.transactionData.to as `0x${string}`,
        abi: [
          {
            name: 'executeTierUpgrade',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [{ name: 'proposalId', type: 'uint256' }],
            outputs: []
          }
        ],
        functionName: 'executeTierUpgrade',
        args: [BigInt(1)] // Use proposal ID 1
      });

    } catch (error: any) {
      console.error('Error executing post:', error);
      toast.error(error.message || 'Failed to execute post');
    } finally {
      setLoading(false);
    }
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technical': 'bg-blue-600',
      'Governance': 'bg-purple-600',
      'Feature': 'bg-green-600',
      'Security': 'bg-red-600',
      'Integration': 'bg-orange-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  if (!isConnected) {
    return (
      <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-mono text-white tracking-wider">
            POST VOTING SYSTEM
          </CardTitle>
          <CardDescription className="text-[#d1d5db] font-mono">
            Connect your wallet to participate in post governance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-white font-mono mb-4">Please connect your wallet to continue</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
      <CardHeader>
        <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
          <MessageSquare className="w-8 h-8" />
          POST VOTING GOVERNANCE
        </CardTitle>
        <CardDescription className="text-[#d1d5db] font-mono">
          Vote on community proposals and feature requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="posts" className="font-mono font-bold">VIEW POSTS</TabsTrigger>
            <TabsTrigger value="vote" className="font-mono font-bold">VOTE ON POST</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6 mt-6">
            {reputationData && (
              <div className="bg-white text-black p-4 border-2 border-white">
                <h3 className="font-mono font-bold mb-2">YOUR VOTING POWER</h3>
                <p className="font-mono text-sm">Token ID: #{reputationData.tokenId}</p>
                <p className="font-mono text-sm">Tier: {reputationData.tier}</p>
                <p className="font-mono text-sm">Score: {reputationData.contributionScore}</p>
              </div>
            )}

            <div className="space-y-4">
              {HARDCODED_POSTS.map((post) => {
                const voteData = postVotes[post.id];
                if (!voteData) return null;

                return (
                  <Card key={post.id} className="bg-white text-black border-2 border-white shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-black font-mono tracking-wider">
                            {post.title}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className={`${getCategoryColor(post.category)} text-white font-mono text-xs`}>
                              {post.category}
                            </Badge>
                            <Badge className="bg-gray-600 text-white font-mono text-xs">
                              #{post.id}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${voteData.isExecuted ? 'bg-green-600' : voteData.isVotingActive ? 'bg-blue-600' : 'bg-red-600'} text-white font-mono`}>
                            {voteData.isExecuted ? 'EXECUTED' : voteData.isVotingActive ? 'ACTIVE' : 'ENDED'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm font-mono leading-relaxed">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-200 text-black px-2 py-1 rounded font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                        <div>
                          <p><strong>Author:</strong> {post.author}</p>
                          <p><strong>Posted:</strong> {new Date(post.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p><strong>Status:</strong> {voteData.isPassing ? 'PASSING' : 'FAILING'}</p>
                          <p><strong>Deadline:</strong> {new Date(voteData.votingDeadline).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-mono">
                          <span>FOR: {voteData.votesFor}</span>
                          <span>AGAINST: {voteData.votesAgainst}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Progress 
                              value={getVotePercentage(voteData.votesFor, voteData.totalVotes)} 
                              className="bg-gray-300 [&>div]:bg-green-600"
                            />
                            <p className="text-xs text-center">FOR</p>
                          </div>
                          <div className="space-y-1">
                            <Progress 
                              value={getVotePercentage(voteData.votesAgainst, voteData.totalVotes)} 
                              className="bg-gray-300 [&>div]:bg-red-600"
                            />
                            <p className="text-xs text-center">AGAINST</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedPost(post.id);
                            setActiveTab('vote');
                          }}
                          disabled={voteData.userHasVoted}
                          className="flex-1 bg-black text-white hover:bg-[#333] font-mono font-bold border-2 border-black shadow-[2px_2px_0px_0px_#666] hover:shadow-[4px_4px_0px_0px_#666] transition-all duration-200"
                        >
                          {voteData.userHasVoted ? 'ALREADY VOTED' : 'VOTE ON POST'}
                        </Button>
                        
                        {voteData.canExecute && (
                          <Button
                            onClick={() => handleExecutePost(post.id)}
                            disabled={loading || isPending || isConfirming}
                            className="bg-green-600 text-white hover:bg-green-700 font-mono font-bold border-2 border-green-600 shadow-[2px_2px_0px_0px_#666] hover:shadow-[4px_4px_0px_0px_#666] transition-all duration-200"
                          >
                            {loading || isPending || isConfirming ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                EXECUTE
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="vote" className="space-y-6 mt-6">
            {selectedPost && (() => {
              const post = HARDCODED_POSTS.find(p => p.id === selectedPost);
              const voteData = postVotes[selectedPost];
              
              if (!post || !voteData) {
                return <div className="text-white font-mono">Post not found</div>;
              }

              return (
                <div className="space-y-6">
                  <div className="bg-white text-black p-4 border-2 border-white space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-mono font-bold">POST #{post.id}</h3>
                      <Badge className={`${voteData.isExecuted ? 'bg-green-600' : voteData.isVotingActive ? 'bg-blue-600' : 'bg-red-600'} text-white font-mono`}>
                        {voteData.isExecuted ? 'EXECUTED' : voteData.isVotingActive ? 'ACTIVE' : 'ENDED'}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-mono font-bold text-lg mb-2">{post.title}</h4>
                      <p className="font-mono text-sm leading-relaxed">{post.content}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <p><strong>Category:</strong> {post.category}</p>
                        <p><strong>Author:</strong> {post.author}</p>
                      </div>
                      <div>
                        <p><strong>Deadline:</strong> {new Date(voteData.votingDeadline).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {voteData.isPassing ? 'PASSING' : 'FAILING'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-mono">
                        <span>FOR: {voteData.votesFor}</span>
                        <span>AGAINST: {voteData.votesAgainst}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Progress 
                            value={getVotePercentage(voteData.votesFor, voteData.totalVotes)} 
                            className="bg-gray-300 [&>div]:bg-green-600"
                          />
                          <p className="text-xs text-center">FOR</p>
                        </div>
                        <div className="space-y-1">
                          <Progress 
                            value={getVotePercentage(voteData.votesAgainst, voteData.totalVotes)} 
                            className="bg-gray-300 [&>div]:bg-red-600"
                          />
                          <p className="text-xs text-center">AGAINST</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {voteData.isVotingActive && !voteData.userHasVoted && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-white font-mono font-bold">YOUR VOTE</label>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setVoteSupport(true)}
                            variant={voteSupport ? "default" : "outline"}
                            className={`flex-1 font-mono ${voteSupport ? 'bg-green-600 text-white' : 'bg-black border-white text-white hover:bg-green-600'}`}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            FOR
                          </Button>
                          <Button
                            onClick={() => setVoteSupport(false)}
                            variant={!voteSupport ? "default" : "outline"}
                            className={`flex-1 font-mono ${!voteSupport ? 'bg-red-600 text-white' : 'bg-black border-white text-white hover:bg-red-600'}`}
                          >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            AGAINST
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={estimateGasCost}
                          className="w-full bg-yellow-600 text-black hover:bg-yellow-700 font-mono font-bold border-2 border-yellow-600 shadow-[2px_2px_0px_0px_#666] hover:shadow-[4px_4px_0px_0px_#666] transition-all duration-200"
                        >
                          ESTIMATE GAS COST
                        </Button>
                        
                        <Button
                          onClick={() => handleVote(selectedPost)}
                          disabled={loading || isPending || isConfirming}
                          className="w-full bg-white text-black hover:bg-[#d1d5db] font-mono font-black tracking-wider py-3 shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-200"
                        >
                          {loading || isPending || isConfirming ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              SUBMITTING VOTE...
                            </>
                          ) : (
                            'SUBMIT VOTE'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {voteData.userHasVoted && (
                    <div className="bg-green-100 border-2 border-green-500 p-4 text-green-800 font-mono">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">You have already voted on this post</span>
                      </div>
                      <p className="text-sm mt-1">
                        Your vote: <strong>{voteData.userVote ? 'FOR' : 'AGAINST'}</strong>
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 