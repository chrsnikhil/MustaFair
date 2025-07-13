"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Trophy,
  Github,
  Mail,
  GitBranch,
  Star,
  Calendar,
  Zap,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useWeb2Achievements } from '@/hooks/use-web2-achievements';

interface Web2AchievementData {
  totalScore: number;
  overallTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  providers: Array<{
    provider: 'github' | 'google';
    data: any;
    achievements: {
      tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
      badges: string[];
      score: number;
    };
  }>;
  combinedBadges: string[];
  metadata: {
    githubCommits?: number;
    githubRepos?: number;
    googleAccountAge?: number;
    googleEmailCount?: number;
    lastUpdated: string;
  };
  achievementHash: string;
}

const tierColors = {
  Bronze: 'bg-amber-600 text-white',
  Silver: 'bg-gray-400 text-black',
  Gold: 'bg-yellow-500 text-black',
  Platinum: 'bg-purple-600 text-white',
};

const tierShadows = {
  Bronze: 'shadow-[4px_4px_0px_0px_#92400e]',
  Silver: 'shadow-[4px_4px_0px_0px_#6b7280]',
  Gold: 'shadow-[4px_4px_0px_0px_#d97706]',
  Platinum: 'shadow-[4px_4px_0px_0px_#7c3aed]',
};

export function Web2AchievementViewer() {
  const { data: session } = useSession();
  const { achievements, loading, error, fetchAchievements, lastFetched } = useWeb2Achievements();

  if (!session) {
    return (
      <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
        <CardContent className="p-6 text-center">
          <p className="text-white font-mono mb-4">Connect your Web2 identity to view achievements</p>
          <p className="text-[#d1d5db] font-mono text-sm">
            Login with GitHub/Google or use Universal Login with CARV ID
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="bg-black border-4 border-white shadow-[16px_16px_0px_0px_#666] hover:shadow-[20px_20px_0px_0px_#666] transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
            <Trophy className="w-8 h-8" />
            WEB2 ACHIEVEMENTS
          </CardTitle>
          <div className="flex gap-4 items-center">
            {!achievements ? (
              <Button
                onClick={fetchAchievements}
                disabled={loading}
                className="bg-white text-black font-black font-mono px-6 py-3 border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 transform -skew-x-1"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Github className="w-5 h-5 mr-2" />}
                {loading ? 'FETCHING GITHUB DATA...' : 'GET GITHUB DATA'}
              </Button>
            ) : (
            <Button
              onClick={fetchAchievements}
              disabled={loading}
              className="bg-white text-black font-black font-mono px-4 py-2 border-4 border-white shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-300"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {loading ? 'FETCHING...' : 'REFRESH'}
            </Button>
            )}
            {achievements && (
              <>
                <Badge className={`${tierColors[achievements.overallTier]} font-mono font-bold px-4 py-2 text-lg border-2 border-white ${tierShadows[achievements.overallTier]}`}>
                  {achievements.overallTier.toUpperCase()} TIER
                </Badge>
                {session?.provider === 'carv-id' && (
                  <Badge className="bg-black text-white font-mono font-bold px-3 py-1 text-sm border-2 border-white">
                    🛡️ FROM CARV ID
                  </Badge>
                )}
              </>
            )}
            {lastFetched && (
              <div className="flex items-center gap-2 text-[#d1d5db] font-mono text-xs">
                <Clock className="w-3 h-3" />
                {new Date(lastFetched).toLocaleTimeString()}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <div className="bg-red-900 border-2 border-red-500 p-4 font-mono text-red-100 mb-6">
              ERROR: {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
              <p className="text-white font-mono">ANALYZING WEB2 ACTIVITIES...</p>
            </div>
          )}

          {!achievements && !loading && (
            <div className="text-center py-12">
              <Github className="w-16 h-16 text-[#d1d5db] mx-auto mb-4" />
              <h3 className="text-white font-mono font-black text-lg mb-2">NO GITHUB DATA LOADED</h3>
              <p className="text-[#d1d5db] font-mono text-sm mb-6">
                Click "GET GITHUB DATA" to analyze your GitHub contributions and achievements
              </p>
              <div className="text-xs text-[#999] font-mono">
                This will fetch your commits, repositories, and calculate your achievement score
              </div>
            </div>
          )}

          {achievements && (
            <div className="space-y-6">
              {/* Overall Score */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1a1a1a] border-2 border-white p-4 text-center"
              >
                <div className="text-4xl font-black font-mono text-white mb-2">
                  {achievements.totalScore.toLocaleString()}
                </div>
                <div className="text-[#d1d5db] font-mono">TOTAL ACHIEVEMENT SCORE</div>
              </motion.div>

              {/* Provider Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.providers.map((provider, index) => (
                  <motion.div
                    key={provider.provider}
                    initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="bg-[#1a1a1a] border-3 border-[#d1d5db] shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-white font-mono">
                          {provider.provider === 'github' ? 
                            <Github className="w-6 h-6" /> : 
                            <Mail className="w-6 h-6" />
                          }
                          {provider.provider.toUpperCase()}
                          <Badge className={`${tierColors[provider.achievements.tier]} font-mono font-bold ml-auto`}>
                            {provider.achievements.tier}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[#d1d5db] font-mono text-sm">SCORE:</span>
                            <span className="text-white font-mono font-bold">
                              {provider.achievements.score.toLocaleString()}
                            </span>
                          </div>

                          {provider.provider === 'github' && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <GitBranch className="w-4 h-4 text-[#d1d5db]" />
                                <span className="text-white font-mono text-sm">
                                  {provider.data.totalCommits?.toLocaleString() || 0} commits
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <Star className="w-4 h-4 text-[#d1d5db]" />
                                <span className="text-white font-mono text-sm">
                                  {provider.data.totalRepositories || 0} repos
                                </span>
                              </div>
                            </div>
                          )}

                          {provider.provider === 'google' && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Mail className="w-4 h-4 text-[#d1d5db]" />
                                <span className="text-white font-mono text-sm">
                                  {provider.data.emailUsage?.totalEmails?.toLocaleString() || 0} emails
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <Calendar className="w-4 h-4 text-[#d1d5db]" />
                                <span className="text-white font-mono text-sm">
                                  {Math.floor((provider.data.accountAge || 0) / 365)} years old
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Badges */}
              {achievements.combinedBadges.length > 0 && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-xl font-black font-mono text-white mb-4 tracking-wider flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    ACHIEVEMENT BADGES
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {achievements.combinedBadges.map((badge, index) => (
                      <motion.div
                        key={badge}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      >
                        <Badge className="bg-[#d1d5db] text-black font-mono font-bold px-3 py-1 border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[5px_5px_0px_0px_#666] transition-all duration-300">
                          {badge}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievement Hash */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#1a1a1a] border-2 border-[#d1d5db] p-4 rounded"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-[#d1d5db]" />
                  <span className="text-white font-mono font-bold">ON-CHAIN HASH:</span>
                </div>
                <div className="font-mono text-sm text-[#d1d5db] break-all bg-black p-2 border border-white">
                  {achievements.achievementHash}
                </div>
                <div className="text-xs text-[#d1d5db] font-mono mt-2">
                  Last updated: {new Date(achievements.metadata.lastUpdated).toLocaleString()}
                </div>
              </motion.div>

              {/* Integration Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-[#d1d5db] text-black p-4 font-mono text-sm border-4 border-white shadow-[8px_8px_0px_0px_#666]"
              >
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Clock className="w-4 h-4" />
                  CARV ID INTEGRATION
                </div>
                <p>
                  These Web2 achievements are automatically included in your CARV ID metadata.
                  The achievement hash above is stored on-chain as part of your decentralized identity.
                </p>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
