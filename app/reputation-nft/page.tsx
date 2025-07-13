"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RepNFTMinter from '@/components/rep-nft-minter';
import TierUpgradeVoting from '@/components/tier-upgrade-voting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Vote, Shield, Link as LinkIcon, Users, Zap, Target, Award, Users2, TrendingUp, ArrowRight } from 'lucide-react';

export default function ReputationNFTPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative p-4 md:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Post Voting Button - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <Link href="/post-voting">
          <motion.button
            whileHover={{ scale: 1.05, skewX: -1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white font-black font-mono px-12 py-4 border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] hover:translate-x-2 hover:translate-y-2 transition-all duration-300 tracking-wider text-base transform -skew-x-1 whitespace-nowrap"
          >
            POST VOTING
            
          </motion.button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white font-mono tracking-[0.2em] transform -skew-x-1">
            REPUTATION NFT
          </h1>
          
          <div className="bg-white text-black px-6 py-2 inline-block transform skew-x-1 border-2 border-white shadow-[4px_4px_0px_0px_#666] font-mono font-black tracking-[0.1em] text-sm md:text-base">
            ERC-721 • CARV ID • GOVERNANCE
          </div>

          <p className="max-w-3xl mx-auto text-[#d1d5db] text-base md:text-lg font-mono leading-relaxed">
            Mint decentralized reputation NFTs with CARV ID integration and community governance.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-black font-mono text-white">0</div>
              <div className="text-xs md:text-sm font-mono text-[#d1d5db]">TOTAL NFTs</div>
            </CardContent>
          </Card>
          <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-black font-mono text-white">0</div>
              <div className="text-xs md:text-sm font-mono text-[#d1d5db]">PROPOSALS</div>
            </CardContent>
          </Card>
          <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-black font-mono text-white">0</div>
              <div className="text-xs md:text-sm font-mono text-[#d1d5db]">VOTES</div>
            </CardContent>
          </Card>
          <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-black font-mono text-white">4</div>
              <div className="text-xs md:text-sm font-mono text-[#d1d5db]">TIERS</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* NFT Minter */}
          <RepNFTMinter />

          {/* Governance System */}
          <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
            <CardHeader>
              <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                <Vote className="w-8 h-8 text-red-500" />
                TIER UPGRADE GOVERNANCE
              </CardTitle>
              <CardDescription className="text-[#d1d5db] font-mono">
                Propose and vote on reputation tier upgrades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TierUpgradeVoting />
            </CardContent>
          </Card>
        </motion.div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-black font-mono text-white tracking-wider text-center">
            SYSTEM OVERVIEW
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* How It Works */}
            <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black font-mono text-white tracking-wider flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  HOW IT WORKS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-[#d1d5db] font-mono text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-600 text-white text-xs mt-1">1</Badge>
                    <span>Mint your reputation NFT with initial tier</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-600 text-white text-xs mt-1">2</Badge>
                    <span>Link your CARV ID for identity verification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 text-white text-xs mt-1">3</Badge>
                    <span>Community can propose tier upgrades</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-orange-600 text-white text-xs mt-1">4</Badge>
                    <span>Vote and execute successful upgrades</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tier System */}
            <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black font-mono text-white tracking-wider flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  TIER SYSTEM
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-[#d1d5db] font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span>🥉 Bronze</span>
                    <Badge className="bg-amber-600 text-white text-xs">0-749</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🥈 Silver</span>
                    <Badge className="bg-gray-400 text-white text-xs">750-1499</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🥇 Gold</span>
                    <Badge className="bg-yellow-500 text-white text-xs">1500-2499</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>💎 Platinum</span>
                    <Badge className="bg-cyan-400 text-white text-xs">2500+</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Governance Process */}
            <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black font-mono text-white tracking-wider flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-red-500" />
                  GOVERNANCE
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-[#d1d5db] font-mono text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-red-600 text-white text-xs mt-1">1</Badge>
                    <span>Create proposal (7-day period)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-orange-600 text-white text-xs mt-1">2</Badge>
                    <span>Community votes (min 3 votes)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 text-white text-xs mt-1">3</Badge>
                    <span>Execute successful proposals</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-600 text-white text-xs mt-1">4</Badge>
                    <span>NFT metadata updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARV ID Integration */}
            <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black font-mono text-white tracking-wider flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-green-500" />
                  CARV ID LINK
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-[#d1d5db] font-mono text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 text-white text-xs mt-1">✓</Badge>
                    <span>Web2 achievements integration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 text-white text-xs mt-1">✓</Badge>
                    <span>On-chain identity verification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 text-white text-xs mt-1">✓</Badge>
                    <span>Contribution score calculation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 text-white text-xs mt-1">✓</Badge>
                    <span>Cross-platform reputation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black font-mono text-white tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  BENEFITS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-[#d1d5db] font-mono text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-600 text-white text-xs mt-1">•</Badge>
                    <span>Decentralized reputation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-600 text-white text-xs mt-1">•</Badge>
                    <span>Community governance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-600 text-white text-xs mt-1">•</Badge>
                    <span>Transparent voting</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-600 text-white text-xs mt-1">•</Badge>
                    <span>Cross-platform identity</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Specs */}
            <Card className="bg-black border-2 border-white shadow-[6px_6px_0px_0px_#666]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black font-mono text-white tracking-wider flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-500" />
                  TECH SPECS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-[#d1d5db] font-mono text-sm">
                  <div className="flex justify-between">
                    <span>Standard:</span>
                    <Badge className="bg-blue-600 text-white text-xs">ERC-721</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <Badge className="bg-yellow-600 text-white text-xs">BNB Testnet</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Voting:</span>
                    <Badge className="bg-red-600 text-white text-xs">7 Days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Security:</span>
                    <Badge className="bg-green-600 text-white text-xs">Audited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
