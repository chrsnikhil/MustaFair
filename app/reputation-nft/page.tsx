"use client"

import React from 'react';
import { motion } from 'framer-motion';
import RepNFTMinter from '@/components/rep-nft-minter';
import TierUpgradeVoting from '@/components/tier-upgrade-voting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Vote, Shield, Link as LinkIcon, Coins, Users } from 'lucide-react';

export default function ReputationNFTPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#222_49%,#222_50%,transparent_52%)] opacity-40"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center space-y-6"
        >
          <h1
            className="text-6xl font-black text-white font-mono tracking-[0.2em] transform -skew-x-1"
            style={{ textShadow: "4px 4px 0px #666, 8px 8px 0px #999" }}
          >
            REPUTATION NFT
            <br />
            <span className="text-4xl tracking-[0.3em] text-[#d1d5db]">GOVERNANCE SYSTEM</span>
          </h1>
          
          <div className="bg-white text-black px-8 py-3 inline-block transform skew-x-1 border-4 border-white shadow-[6px_6px_0px_0px_#666] font-mono font-black tracking-[0.2em]">
            ERC-721 • CARV ID INTEGRATION • COMMUNITY VOTING
          </div>

          <p className="max-w-4xl mx-auto text-[#d1d5db] text-lg font-mono leading-relaxed">
            Mint decentralized reputation NFTs on BNB Testnet with metadata linking to your CARV ID profile. 
            Community governance enables tier upgrades through transparent voting mechanisms.
          </p>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                NFT MINTING
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[#d1d5db] font-mono text-sm leading-relaxed">
                Mint ERC-721 reputation NFTs with contribution scores, tier rankings, and creation timestamps.
              </p>
              <div className="space-y-2">
                <Badge className="bg-yellow-600 text-white font-mono">CONTRIBUTION SCORE</Badge>
                <Badge className="bg-purple-600 text-white font-mono">TIER SYSTEM</Badge>
                <Badge className="bg-blue-600 text-white font-mono">METADATA</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <LinkIcon className="w-6 h-6 text-green-500" />
                CARV ID LINK
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[#d1d5db] font-mono text-sm leading-relaxed">
                Automatic integration with CARV ID profiles for Web2/Web3 identity binding and achievement tracking.
              </p>
              <div className="space-y-2">
                <Badge className="bg-green-600 text-white font-mono">IDENTITY HASH</Badge>
                <Badge className="bg-cyan-600 text-white font-mono">WEB2 ACHIEVEMENTS</Badge>
                <Badge className="bg-indigo-600 text-white font-mono">ON-CHAIN LINK</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Vote className="w-6 h-6 text-red-500" />
                GOVERNANCE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[#d1d5db] font-mono text-sm leading-relaxed">
                Community-driven tier upgrades through transparent voting with 7-day proposal periods.
              </p>
              <div className="space-y-2">
                <Badge className="bg-red-600 text-white font-mono">VOTING SYSTEM</Badge>
                <Badge className="bg-orange-600 text-white font-mono">PROPOSALS</Badge>
                <Badge className="bg-pink-600 text-white font-mono">EXECUTION</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Specs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="bg-black border-4 border-white shadow-[16px_16px_0px_0px_#666]">
            <CardHeader>
              <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Shield className="w-8 h-8" />
                TECHNICAL SPECIFICATIONS
              </CardTitle>
              <CardDescription className="text-[#d1d5db] font-mono">
                Smart contract architecture and blockchain integration details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-black font-mono text-white tracking-wider">CONTRACT FEATURES</h3>
                  <div className="space-y-2 text-[#d1d5db] font-mono text-sm">
                    <div className="flex justify-between">
                      <span>• ERC-721 Standard Compliance</span>
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>• CARV ID Interface Integration</span>
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>• Voting System with Timelock</span>
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>• Reentrancy Protection</span>
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>• Ownable Access Control</span>
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>• Dynamic Metadata Generation</span>
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black font-mono text-white tracking-wider">DEPLOYMENT INFO</h3>
                  <div className="space-y-2 text-[#d1d5db] font-mono text-sm">
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <Badge className="bg-yellow-600 text-white">BNB Testnet</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Chain ID:</span>
                      <Badge className="bg-gray-600 text-white">97</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Voting Period:</span>
                      <Badge className="bg-blue-600 text-white">7 Days</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Votes Required:</span>
                      <Badge className="bg-purple-600 text-white">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tier Levels:</span>
                      <Badge className="bg-orange-600 text-white">4 Tiers</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Optimized:</span>
                      <Badge className="bg-green-600 text-white">✓</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Components */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          <RepNFTMinter />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          <TierUpgradeVoting />
        </motion.div>

        {/* Governance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-black border-4 border-white shadow-[16px_16px_0px_0px_#666]">
            <CardHeader>
              <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Users className="w-8 h-8" />
                GOVERNANCE STATISTICS
              </CardTitle>
              <CardDescription className="text-[#d1d5db] font-mono">
                Live statistics from the reputation governance system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-black font-mono text-white">0</div>
                  <div className="text-sm font-mono text-[#d1d5db]">TOTAL NFTs</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-black font-mono text-white">0</div>
                  <div className="text-sm font-mono text-[#d1d5db]">ACTIVE PROPOSALS</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-black font-mono text-white">0</div>
                  <div className="text-sm font-mono text-[#d1d5db]">TOTAL VOTES</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-black font-mono text-white">0</div>
                  <div className="text-sm font-mono text-[#d1d5db]">TIER UPGRADES</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white">
                <p className="text-[#d1d5db] font-mono text-sm text-center">
                  Deploy the smart contracts to see live governance statistics and interact with the system.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
