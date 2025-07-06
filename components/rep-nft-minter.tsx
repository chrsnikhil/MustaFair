"use client"

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, Star, Crown, Award } from 'lucide-react';
import { toast } from 'sonner';

interface ReputationData {
  wallet: string;
  tokenId: string | null;
  contributionScore: string;
  tier: string;
  tierLevel: number;
  creationDate: string | null;
  carvIdLinked: boolean;
  isActive: boolean;
  metadata?: any;
}

const tierIcons = {
  Bronze: Award,
  Silver: Star,
  Gold: Trophy,
  Platinum: Crown
};

const tierColors = {
  Bronze: 'bg-amber-600',
  Silver: 'bg-gray-400',
  Gold: 'bg-yellow-500',
  Platinum: 'bg-purple-500'
};

export default function RepNFTMinter() {
  const { address, isConnected } = useAccount();
  const [contributionScore, setContributionScore] = useState<number>(100);
  const [selectedTier, setSelectedTier] = useState<string>('Bronze');
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch existing reputation data
  const fetchReputationData = async () => {
    if (!address) return;
    
    setFetchingData(true);
    try {
      const response = await fetch(`/api/reputation-nft/${address}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setReputationData(result.data);
      } else {
        setReputationData(null);
      }
    } catch (error) {
      console.error('Error fetching reputation data:', error);
      toast.error('Failed to fetch reputation data');
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchReputationData();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Reputation NFT minted successfully!');
      fetchReputationData(); // Refresh data
    }
  }, [isSuccess]);

  const handleMint = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setLoading(true);
    try {
      // Get transaction data from API
      const response = await fetch(`/api/reputation-nft/${address}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mint',
          contributionScore,
          tier: selectedTier
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to prepare transaction');
      }

      // Execute the transaction
      writeContract({
        address: result.transactionData.to as `0x${string}`,
        abi: [
          {
            name: 'mintReputationNFT',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'contributionScore', type: 'uint256' },
              { name: 'tier', type: 'uint8' }
            ],
            outputs: []
          }
        ],
        functionName: 'mintReputationNFT',
        args: [BigInt(contributionScore), selectedTier === 'Bronze' ? 0 : selectedTier === 'Silver' ? 1 : selectedTier === 'Gold' ? 2 : 3]
      });

    } catch (error: any) {
      console.error('Error minting reputation NFT:', error);
      toast.error(error.message || 'Failed to mint reputation NFT');
    } finally {
      setLoading(false);
    }
  };

  const calculateScoreFromCarvId = () => {
    // In a real implementation, this would calculate score based on CARV ID achievements
    const baseScore = Math.floor(Math.random() * 1000) + 500;
    setContributionScore(baseScore);
    toast.success('Score calculated from CARV ID achievements');
  };

  if (!isConnected) {
    return (
      <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-mono text-white tracking-wider">
            REPUTATION NFT MINTER
          </CardTitle>
          <CardDescription className="text-[#d1d5db] font-mono">
            Connect your wallet to mint reputation NFTs
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

  if (fetchingData) {
    return (
      <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="ml-3 text-white font-mono">Loading reputation data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Existing NFT Display */}
      {reputationData && (
        <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
          <CardHeader>
            <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
              {React.createElement(tierIcons[reputationData.tier as keyof typeof tierIcons] || Award, { 
                className: `w-8 h-8 ${tierColors[reputationData.tier as keyof typeof tierColors] || 'text-amber-600'}` 
              })}
              YOUR REPUTATION NFT
            </CardTitle>
            <CardDescription className="text-[#d1d5db] font-mono">
              Token ID: #{reputationData.tokenId}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-mono text-sm">CONTRIBUTION SCORE</Label>
                <div className="bg-white text-black px-3 py-2 font-mono font-black">
                  {reputationData.contributionScore}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white font-mono text-sm">TIER</Label>
                <Badge className={`${tierColors[reputationData.tier as keyof typeof tierColors]} text-white font-mono`}>
                  {reputationData.tier}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-white font-mono text-sm">CARV ID</Label>
                <Badge className={`${reputationData.carvIdLinked ? 'bg-green-600' : 'bg-red-600'} text-white font-mono`}>
                  {reputationData.carvIdLinked ? 'LINKED' : 'NOT LINKED'}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-white font-mono text-sm">STATUS</Label>
                <Badge className={`${reputationData.isActive ? 'bg-green-600' : 'bg-gray-600'} text-white font-mono`}>
                  {reputationData.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
            </div>
            
            {reputationData.creationDate && (
              <div className="mt-4 pt-4 border-t border-white">
                <p className="text-[#d1d5db] font-mono text-sm">
                  Created: {new Date(reputationData.creationDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Minting Interface */}
      {!reputationData && (
        <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
          <CardHeader>
            <CardTitle className="text-2xl font-black font-mono text-white tracking-wider">
              MINT REPUTATION NFT
            </CardTitle>
            <CardDescription className="text-[#d1d5db] font-mono">
              Create your decentralized reputation with CARV ID integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="score" className="text-white font-mono">CONTRIBUTION SCORE</Label>
                <div className="flex gap-2">
                  <Input
                    id="score"
                    type="number"
                    value={contributionScore}
                    onChange={(e) => setContributionScore(parseInt(e.target.value) || 0)}
                    min="0"
                    max="10000"
                    className="bg-white text-black border-2 border-white font-mono"
                  />
                  <Button
                    onClick={calculateScoreFromCarvId}
                    variant="outline"
                    className="bg-black border-2 border-white text-white hover:bg-white hover:text-black font-mono"
                  >
                    AUTO CALC
                  </Button>
                </div>
                <p className="text-[#d1d5db] text-sm font-mono">
                  Score based on your Web2/Web3 contributions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier" className="text-white font-mono">INITIAL TIER</Label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
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
                <p className="text-[#d1d5db] text-sm font-mono">
                  Can be upgraded through community voting
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white">
              <Button
                onClick={handleMint}
                disabled={loading || isPending || isConfirming}
                className="w-full bg-white text-black hover:bg-[#d1d5db] font-mono font-black tracking-wider text-lg py-3 shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-200"
              >
                {loading || isPending || isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {isPending ? 'CONFIRMING...' : isConfirming ? 'MINTING...' : 'PROCESSING...'}
                  </>
                ) : (
                  'MINT REPUTATION NFT'
                )}
              </Button>
            </div>

            <div className="text-[#d1d5db] text-sm font-mono space-y-1">
              <p>• NFT will be linked to your CARV ID if available</p>
              <p>• Metadata includes contribution score, tier, and creation date</p>
              <p>• Deployed on BNB Testnet with governance voting</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
