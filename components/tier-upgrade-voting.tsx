"use client"

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Vote, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ProposalData {
  proposalId: number;
  tokenId: string;
  proposedTier: string;
  proposedTierLevel: number;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  proposalDeadline: string;
  isExecuted: boolean;
  isVotingActive: boolean;
  isPassing: boolean;
  canExecute: boolean;
}

interface ReputationData {
  tokenId: string | null;
  tier: string;
  contributionScore: string;
  isActive: boolean;
}

export default function TierUpgradeVoting() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  
  // Create proposal state
  const [tokenId, setTokenId] = useState<string>('');
  const [proposedTier, setProposedTier] = useState<string>('Silver');
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  
  // View/Vote proposal state
  const [proposalId, setProposalId] = useState<string>('');
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [voteSupport, setVoteSupport] = useState<boolean>(true);
  const [voteReason, setVoteReason] = useState<string>('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch user's reputation data
  const fetchReputationData = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`/api/reputation-nft/${address}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setReputationData(result.data);
        setTokenId(result.data.tokenId);
      }
    } catch (error) {
      console.error('Error fetching reputation data:', error);
    }
  };

  // Fetch proposal data
  const fetchProposalData = async (id: string) => {
    if (!id || isNaN(parseInt(id))) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/voting/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setProposalData(result.data);
      } else {
        toast.error('Proposal not found');
        setProposalData(null);
      }
    } catch (error) {
      console.error('Error fetching proposal data:', error);
      toast.error('Failed to fetch proposal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchReputationData();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction successful!');
      if (proposalId) {
        fetchProposalData(proposalId);
      }
      fetchReputationData();
    }
  }, [isSuccess]);

  const handleCreateProposal = async () => {
    if (!address || !tokenId || !proposedTier) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/voting/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          tokenId,
          proposedTier
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
        args: [BigInt(tokenId), proposedTier === 'Bronze' ? 0 : proposedTier === 'Silver' ? 1 : proposedTier === 'Gold' ? 2 : 3]
      });

    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast.error(error.message || 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!address || !proposalId || !proposalData) {
      toast.error('Invalid voting parameters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/voting/${proposalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          support: voteSupport,
          reason: voteReason,
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
        args: [BigInt(proposalId), voteSupport, voteReason]
      });

    } catch (error: any) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteProposal = async () => {
    if (!address || !proposalId) {
      toast.error('Invalid execution parameters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/voting/${proposalId}`, {
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
        args: [BigInt(proposalId)]
      });

    } catch (error: any) {
      console.error('Error executing proposal:', error);
      toast.error(error.message || 'Failed to execute proposal');
    } finally {
      setLoading(false);
    }
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  if (!isConnected) {
    return (
      <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-mono text-white tracking-wider">
            TIER UPGRADE VOTING
          </CardTitle>
          <CardDescription className="text-[#d1d5db] font-mono">
            Connect your wallet to participate in governance
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
          <Vote className="w-8 h-8" />
          TIER UPGRADE GOVERNANCE
        </CardTitle>
        <CardDescription className="text-[#d1d5db] font-mono">
          Propose and vote on reputation tier upgrades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="create" className="font-mono font-bold">CREATE PROPOSAL</TabsTrigger>
            <TabsTrigger value="vote" className="font-mono font-bold">VIEW & VOTE</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            {reputationData && (
              <div className="bg-white text-black p-4 border-2 border-white">
                <h3 className="font-mono font-bold mb-2">YOUR CURRENT NFT</h3>
                <p className="font-mono text-sm">Token ID: #{reputationData.tokenId}</p>
                <p className="font-mono text-sm">Current Tier: {reputationData.tier}</p>
                <p className="font-mono text-sm">Score: {reputationData.contributionScore}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenId" className="text-white font-mono">TOKEN ID</Label>
                <Input
                  id="tokenId"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="Enter NFT token ID"
                  className="bg-white text-black border-2 border-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposedTier" className="text-white font-mono">PROPOSED TIER</Label>
                <Select value={proposedTier} onValueChange={setProposedTier}>
                  <SelectTrigger className="bg-white text-black border-2 border-white font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronze">🥉 BRONZE</SelectItem>
                    <SelectItem value="Silver">🥈 SILVER</SelectItem>
                    <SelectItem value="Gold">🥇 GOLD</SelectItem>
                    <SelectItem value="Platinum">💎 PLATINUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateProposal}
                disabled={loading || isPending || isConfirming || !tokenId}
                className="w-full bg-white text-black hover:bg-[#d1d5db] font-mono font-black tracking-wider py-3 shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-200"
              >
                {loading || isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    CREATING PROPOSAL...
                  </>
                ) : (
                  'CREATE TIER UPGRADE PROPOSAL'
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="vote" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proposalId" className="text-white font-mono">PROPOSAL ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="proposalId"
                    value={proposalId}
                    onChange={(e) => setProposalId(e.target.value)}
                    placeholder="Enter proposal ID"
                    className="bg-white text-black border-2 border-white font-mono"
                  />
                  <Button
                    onClick={() => fetchProposalData(proposalId)}
                    disabled={!proposalId || loading}
                    variant="outline"
                    className="bg-black border-2 border-white text-white hover:bg-white hover:text-black font-mono"
                  >
                    LOAD
                  </Button>
                </div>
              </div>

              {proposalData && (
                <div className="space-y-4">
                  <div className="bg-white text-black p-4 border-2 border-white space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-mono font-bold">PROPOSAL #{proposalData.proposalId}</h3>
                      <Badge className={`${proposalData.isExecuted ? 'bg-green-600' : proposalData.isVotingActive ? 'bg-blue-600' : 'bg-red-600'} text-white font-mono`}>
                        {proposalData.isExecuted ? 'EXECUTED' : proposalData.isVotingActive ? 'ACTIVE' : 'ENDED'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <p><strong>Token ID:</strong> #{proposalData.tokenId}</p>
                        <p><strong>Proposed Tier:</strong> {proposalData.proposedTier}</p>
                      </div>
                      <div>
                        <p><strong>Deadline:</strong> {new Date(proposalData.proposalDeadline).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {proposalData.isPassing ? 'PASSING' : 'FAILING'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-mono">
                        <span>FOR: {proposalData.votesFor}</span>
                        <span>AGAINST: {proposalData.votesAgainst}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Progress 
                            value={getVotePercentage(proposalData.votesFor, proposalData.totalVotes)} 
                            className="bg-gray-300 [&>div]:bg-green-600"
                          />
                          <p className="text-xs text-center">FOR</p>
                        </div>
                        <div className="space-y-1">
                          <Progress 
                            value={getVotePercentage(proposalData.votesAgainst, proposalData.totalVotes)} 
                            className="bg-gray-300 [&>div]:bg-red-600"
                          />
                          <p className="text-xs text-center">AGAINST</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {proposalData.isVotingActive && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white font-mono">YOUR VOTE</Label>
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
                        <Label htmlFor="voteReason" className="text-white font-mono">REASON (OPTIONAL)</Label>
                        <Textarea
                          id="voteReason"
                          value={voteReason}
                          onChange={(e) => setVoteReason(e.target.value)}
                          placeholder="Explain your vote..."
                          className="bg-white text-black border-2 border-white font-mono"
                        />
                      </div>

                      <Button
                        onClick={handleVote}
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
                  )}

                  {proposalData.canExecute && (
                    <Button
                      onClick={handleExecuteProposal}
                      disabled={loading || isPending || isConfirming}
                      className="w-full bg-green-600 text-white hover:bg-green-700 font-mono font-black tracking-wider py-3 shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-200"
                    >
                      {loading || isPending || isConfirming ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          EXECUTING...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          EXECUTE TIER UPGRADE
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
