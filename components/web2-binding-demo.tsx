"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Github,
  Mail,
  Link,
  Shield,
  Database,
  Hash,
  CheckCircle,
  ExternalLink,
  Copy,
  Zap
} from "lucide-react";

const demoAchievementData = {
  github: {
    totalCommits: 1847,
    totalRepositories: 23,
    totalPullRequests: 156,
    followers: 89,
    languages: ['TypeScript', 'Python', 'Solidity', 'JavaScript', 'Go'],
    achievements: {
      tier: 'Gold',
      score: 2340,
      badges: ['Commit Master', 'PR Expert', 'Polyglot', 'Repository Owner']
    }
  },
  google: {
    accountAge: 2840, // ~7.8 years
    emailUsage: { totalEmails: 28450 },
    achievements: {
      tier: 'Silver',
      score: 1180,
      badges: ['Google Veteran (7+ years)', 'Email Master', 'Drive Power User']
    }
  },
  combined: {
    totalScore: 3520,
    overallTier: 'Gold',
    achievementHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c5f7',
    badges: ['Commit Master', 'PR Expert', 'Polyglot', 'Google Veteran', 'Multi-Platform User', 'Web2 Champion']
  }
};

const steps = [
  {
    title: 'Connect Web2 Accounts',
    description: 'Sign in with GitHub and Google to access your activity data',
    icon: Link,
    status: 'completed'
  },
  {
    title: 'Analyze Contributions',
    description: 'AI system processes commits, PRs, emails, and account history',
    icon: Database,
    status: 'completed'
  },
  {
    title: 'Generate Achievement Hash',
    description: 'Create cryptographic proof of your Web2 activities',
    icon: Hash,
    status: 'completed'
  },
  {
    title: 'Bind to CARV ID',
    description: 'Store achievement metadata on-chain with your identity',
    icon: Shield,
    status: 'completed'
  }
];

export function Web2BindingDemo() {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(demoAchievementData.combined.achievementHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <Card className="bg-black border-4 border-white shadow-[16px_16px_0px_0px_#666] hover:shadow-[20px_20px_0px_0px_#666] transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
            <Zap className="w-8 h-8" />
            WEB2 ACHIEVEMENT BINDING DEMO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Process Steps */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <motion.div
                    className={`w-16 h-16 mx-auto rounded-none border-4 border-white flex items-center justify-center shadow-[6px_6px_0px_0px_#666] ${
                      step.status === 'completed' ? 'bg-white text-black' : 'bg-black text-white'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-8 h-8" />
                  </motion.div>
                  {step.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
                <h3 className="text-white font-mono font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-[#d1d5db] font-mono text-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievement Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-[#1a1a1a] border-2 border-white p-6 mb-6"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Github className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-black font-mono text-white">
                  {demoAchievementData.github.totalCommits.toLocaleString()}
                </div>
                <div className="text-[#d1d5db] font-mono text-sm">GitHub Commits</div>
                <Badge className="bg-yellow-500 text-black font-mono font-bold mt-2">
                  {demoAchievementData.github.achievements.tier}
                </Badge>
              </div>
              <div>
                <Mail className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-black font-mono text-white">
                  {Math.floor(demoAchievementData.google.accountAge / 365)}
                </div>
                <div className="text-[#d1d5db] font-mono text-sm">Years on Google</div>
                <Badge className="bg-gray-400 text-black font-mono font-bold mt-2">
                  {demoAchievementData.google.achievements.tier}
                </Badge>
              </div>
              <div>
                <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-black font-mono text-white">
                  {demoAchievementData.combined.totalScore.toLocaleString()}
                </div>
                <div className="text-[#d1d5db] font-mono text-sm">Combined Score</div>
                <Badge className="bg-yellow-500 text-black font-mono font-bold mt-2">
                  {demoAchievementData.combined.overallTier}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Achievement Hash */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-[#1a1a1a] border-2 border-[#d1d5db] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-[#d1d5db]" />
                <span className="text-white font-mono font-bold">ON-CHAIN ACHIEVEMENT HASH:</span>
              </div>
              <Button
                onClick={copyHash}
                variant="ghost"
                size="sm"
                className="text-[#d1d5db] hover:text-white font-mono"
              >
                {copiedHash ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedHash ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="font-mono text-sm text-[#d1d5db] break-all bg-black p-3 border border-white">
              {demoAchievementData.combined.achievementHash}
            </div>
            <div className="text-xs text-[#d1d5db] font-mono mt-2">
              This hash represents your verifiable Web2 achievement data stored on BNB Testnet
            </div>
          </motion.div>

          {/* Toggle Details */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white text-black font-black font-mono px-6 py-3 border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[10px_10px_0px_0px_#666] transition-all duration-300"
            >
              {showDetails ? 'HIDE DETAILS' : 'SHOW TECHNICAL DETAILS'}
            </Button>
          </div>

          {/* Technical Details */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-[#1a1a1a] border-2 border-[#d1d5db]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white font-mono flex items-center gap-2">
                      <Github className="w-5 h-5" />
                      GitHub Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#d1d5db] font-mono text-sm">Repositories:</span>
                      <span className="text-white font-mono">{demoAchievementData.github.totalRepositories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#d1d5db] font-mono text-sm">Pull Requests:</span>
                      <span className="text-white font-mono">{demoAchievementData.github.totalPullRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#d1d5db] font-mono text-sm">Followers:</span>
                      <span className="text-white font-mono">{demoAchievementData.github.followers}</span>
                    </div>
                    <div className="mt-3">
                      <div className="text-[#d1d5db] font-mono text-sm mb-2">Languages:</div>
                      <div className="flex flex-wrap gap-1">
                        {demoAchievementData.github.languages.map((lang) => (
                          <Badge key={lang} className="bg-[#d1d5db] text-black font-mono text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1a1a] border-2 border-[#d1d5db]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white font-mono flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Google Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#d1d5db] font-mono text-sm">Account Age:</span>
                      <span className="text-white font-mono">{Math.floor(demoAchievementData.google.accountAge / 365)} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#d1d5db] font-mono text-sm">Email Activity:</span>
                      <span className="text-white font-mono">{demoAchievementData.google.emailUsage.totalEmails.toLocaleString()}</span>
                    </div>
                    <div className="mt-3">
                      <div className="text-[#d1d5db] font-mono text-sm mb-2">Achievements:</div>
                      <div className="space-y-1">
                        {demoAchievementData.google.achievements.badges.map((badge) => (
                          <Badge key={badge} className="bg-[#d1d5db] text-black font-mono text-xs mr-1 mb-1">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Integration Info */}
              <Card className="bg-[#d1d5db] text-black border-4 border-white shadow-[8px_8px_0px_0px_#666]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 font-bold mb-2">
                    <ExternalLink className="w-4 h-4" />
                    TECHNICAL IMPLEMENTATION
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <p>• Web2 data is fetched via OAuth (GitHub/Google APIs)</p>
                    <p>• Achievement scores calculated using weighted algorithms</p>
                    <p>• Cryptographic hash generated from achievement metadata</p>
                    <p>• Hash stored on-chain in ModularCarvID contract (ERC-7231)</p>
                    <p>• Zero-knowledge proof of Web2 activities without exposing raw data</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
