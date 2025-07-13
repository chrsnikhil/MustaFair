'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Terminal,
  Wrench,
  HardDrive,
  Cpu,
  Settings,
  Monitor,
  Server,
  ArrowRight,
  Power,
  Zap,
  LogIn,
  Trophy,
  Play,
  Github,
  BookOpen,
  Settings2,
  Shield,
  Key,
  Database,
  Network,
} from 'lucide-react';
import { LoginButton } from './components/providers';
import { OAuthLogin } from './components/oauth-login';
import { IdentityGraph } from './components/identity-graph';
import MintCarvIdDialog from "@/components/MintCarvIdDialog";
import { CarvIdPassportDialog } from "@/components/carv-id-viewer";
import { Web2AchievementViewer } from "@/components/web2-achievement-viewer";
import { Web2BindingDemo } from "@/components/web2-binding-demo";
import ContractStatusChecker from "@/components/contract-status-checker";
import { TeamPassport } from "@/components/team-passport";
import { useSession } from 'next-auth/react';
import { useAccount, useReadContract } from 'wagmi';
import { bscTestnet, localhost } from 'wagmi/chains';
import carvIdAbiData from "@/lib/ModularCarvID_ABI.json";
import Link from 'next/link';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const carvIdAbi = carvIdAbiData.abi; // Use just the ABI array

export default function MustaFairBlackLanding() {
  const { data: session, status } = useSession();
  const { address, isConnected, chain } = useAccount();
  
  // Check for on-chain CARV ID ownership
  const isOnCorrectNetwork = chain?.id === bscTestnet.id || chain?.id === localhost.id;
  
  const { data: tokenId, error: tokenIdError } = useReadContract({
    address: contractAddress,
    abi: carvIdAbi,
    functionName: "walletToTokenId",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && isOnCorrectNetwork && !!address,
    },
  });

  // Check if user has a CARV ID on-chain
  const hasCarvIdOnChain = tokenId !== undefined && tokenId !== null && Number(tokenId) > 0;
  
  // Determine the authentication status
  const getAuthStatus = () => {
    if (session?.provider === 'carv-id') {
      return { text: '🛡️ CARV ID', hasCarvId: true };
    }
    if (hasCarvIdOnChain) {
      return { text: '🛡️ CARV ID (ON-CHAIN)', hasCarvId: true };
    }
    if (session?.provider) {
      return { text: `✓ ${session.provider.toUpperCase()}`, hasCarvId: false };
    }
    return { text: 'NOT CONNECTED', hasCarvId: false };
  };

  const authStatus = getAuthStatus();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matte Background - Fixed with proper visibility */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#222_49%,#222_50%,transparent_52%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(67deg,transparent_48%,#333_49%,#333_50%,transparent_52%)] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(156deg,transparent_48%,#444_49%,#444_50%,transparent_52%)] opacity-35"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] opacity-70"></div>
      </div>

      {/* Spotlight Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10 blur-xl" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 opacity-8 blur-xl" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, transparent 80%)' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 opacity-6 blur-xl" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 50%, transparent 90%)' }}></div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-50 p-6"
      >
        <div className="flex justify-between items-center">
          <motion.div
            className="bg-white text-black px-6 py-3 font-mono font-black tracking-[0.2em] border-4 border-white shadow-[6px_6px_0px_0px_#666] transform -skew-x-2 cursor-pointer"
            whileHover={{
              scale: 1.05,
              rotate: 1,
              boxShadow: '8px_8px_0px_0px_#666',
              transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
            whileTap={{ scale: 0.95 }}
          >
            MUSTAFAIR.SYS
          </motion.div>
          <div className="flex gap-4 items-center">
            {!session && !hasCarvIdOnChain ? (
              <Link href="/auth/signin">
                <Button className="bg-black text-white font-mono px-4 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 hover:text-black transition-all duration-300 rounded-none text-xs tracking-widest transform -skew-x-1">
                  <LogIn className="w-4 h-4 mr-2" />
                  UNIVERSAL LOGIN
                </Button>
              </Link>
            ) : (
              <div className="font-mono text-white text-xs tracking-widest bg-[#333] px-4 py-2 border-2 border-white">
                {authStatus.text}
              </div>
            )}
            <OAuthLogin navStyle />
            <LoginButton navStyle />
            <CarvIdPassportDialog />
            <motion.div
              className="w-4 h-4 bg-white border-2 border-white shadow-[2px_2px_0px_0px_#666]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 py-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Project Overview Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.5,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="grid lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Main Project Card */}
            <div className="lg:col-span-2">
              <motion.div
                whileHover={{
                  y: -8,
                  rotate: 0.5,
                  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
              >
                <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] relative hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500 ease-out">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex gap-2">
                        <motion.div
                          className="w-4 h-4 bg-[#666] border border-white shadow-[1px_1px_0px_0px_#666]"
                          whileHover={{ scale: 1.2, rotate: 45 }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div
                          className="w-4 h-4 bg-[#999] border border-white shadow-[1px_1px_0px_0px_#666]"
                          whileHover={{ scale: 1.2, rotate: 45 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        />
                        <motion.div
                          className="w-4 h-4 bg-white border border-white shadow-[1px_1px_0px_0px_#666]"
                          whileHover={{ scale: 1.2, rotate: 45 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-white font-mono text-sm">
                        CARV_ID_IMPLEMENTATION.exe
                      </span>
                    </div>

                    <div className="space-y-4 font-mono text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          root@mustafair:~$
                        </span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          npm run deploy-carv-id
                        </motion.span>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="space-y-2 text-sm"
                      >
                        <div>
                          [INFO] npm install @carv/modular-identity
                        </div>
                        <div>[INFO] npm run build:achievement-binding</div>
                        <div>
                          [SUCCESS] CARV ID Modular Implementation Ready
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="pt-6"
                      >
                        <h1
                          className="text-4xl lg:text-6xl font-black tracking-[0.1em] transform -skew-x-1 mb-4 text-white"
                          style={{
                            textShadow: '3px 3px 0px #666, 6px 6px 0px #999',
                          }}
                        >
                          CARV ID
                          <br />
                          <span className="text-[#d1d5db]">
                            MODULAR IMPLEMENTATION
                          </span>
                        </h1>
                        <p className="text-[#d1d5db] text-lg tracking-wide max-w-lg">
                          FULL-FLEDGED MODULAR IDENTITY SYSTEM WITH ACHIEVEMENT BINDING AND DECENTRALIZED REPUTATION.
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Status Panel */}
            <div className="flex flex-col h-full justify-between">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
                className="flex-1"
              >
                <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] relative before:absolute before:top-2 before:right-2 before:w-6 before:h-6 before:bg-white before:transform before:rotate-45 hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-400 ease-out h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-12 h-12 bg-black border-3 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#666]"
                        whileHover={{
                          rotate: 360,
                          scale: 1.1,
                          transition: {
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          },
                        }}
                      >
                        <Shield className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-mono font-black text-lg text-white">
                          PROJECT STATUS
                        </h3>
                        <p className="font-mono text-sm text-[#d1d5db]">
                          ALL SYSTEMS OPERATIONAL
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 flex-1 flex flex-col justify-end">
                      <div className="flex justify-between font-mono text-sm text-white">
                        <span>CARV ID</span>
                        <span>ACTIVE</span>
                      </div>
                      <div className="w-full h-3 bg-black border-2 border-white">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{
                            delay: 1.2,
                            duration: 1.5,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="h-full bg-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
                className="flex-1"
              >
                <Card className="bg-black border-4 border-[#d1d5db] shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-400 ease-out h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-12 h-12 bg-black border-3 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#666]"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        <Key className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-mono font-black text-lg text-white">
                          VOTING SYSTEM
                        </h3>
                        <p className="font-mono text-sm text-[#d1d5db]">
                          POST VOTING: ENABLED
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="w-full h-8 bg-black border-2 border-white relative overflow-hidden"
                      >
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                          }}
                          className="absolute inset-0 bg-white opacity-30"
                        />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
                className="flex-1"
              >
                <Card className="bg-black border-4 border-[#d1d5db] shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-400 ease-out h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="w-12 h-12 bg-black border-3 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_#666]"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        <Database className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-mono font-black text-lg text-white">
                          ACHIEVEMENT BINDING
                        </h3>
                        <p className="font-mono text-sm text-[#d1d5db]">
                          GITHUB: CONNECTED
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="w-full h-8 bg-black border-2 border-white relative overflow-hidden"
                      >
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                          }}
                          className="absolute inset-0 bg-white opacity-30"
                        />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Identity Core */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="my-16 md:my-24"
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl lg:text-4xl font-black tracking-[0.1em] text-white uppercase"
                style={{ textShadow: '2px_2px_0px_#666' }}
              >
                Identity Graph Matrix
              </h2>
              <p className="text-[#d1d5db] mt-2 max-w-2xl mx-auto font-mono tracking-wide">
                VISUALIZE YOUR MODULAR DIGITAL IDENTITY • ERC-7231 COMPLIANT INFRASTRUCTURE
              </p>
            </div>
            <div className="max-w-5xl mx-auto space-y-6">
              <IdentityGraph />
              <div className="flex justify-center">
                <MintCarvIdDialog />
              </div>
            </div>
          </motion.div>

          {/* Web2 Achievements Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="my-16 md:my-24"
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl lg:text-4xl font-black tracking-[0.1em] text-white uppercase"
                style={{ textShadow: '2px_2px_0px_#666' }}
              >
                Web2 Achievement Mining
              </h2>
              <p className="text-[#d1d5db] mt-2 max-w-2xl mx-auto font-mono tracking-wide">
                BIND GITHUB COMMITS & GOOGLE DATA • ON-CHAIN REPUTATION SYSTEM
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <Web2AchievementViewer />
            </div>
            </motion.div>

          {/* Reputation NFT Section */}
            <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.0, duration: 1 }}
            className="my-16 md:my-24"
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl lg:text-4xl font-black tracking-[0.1em] text-white uppercase"
                style={{ textShadow: '2px_2px_0px_#666' }}
            >
                Reputation NFT Governance
              </h2>
              <p className="text-[#d1d5db] mt-2 max-w-2xl mx-auto font-mono tracking-wide">
                MINT ERC-721 REPUTATION TOKENS • COMMUNITY VOTING SYSTEM • TIER UPGRADES
              </p>
            </div>
            <div className="max-w-5xl mx-auto text-center">
              <Link href="/reputation-nft">
                <Button className="bg-black text-white font-black font-mono px-12 py-6 border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 tracking-wider text-lg transform -skew-x-1">
                  <Trophy className="w-6 h-6 mr-3" />
                  ACCESS REPUTATION NFT SYSTEM
              </Button>
              </Link>
              <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-[#1a1a1a] border-2 border-white p-4">
                  <div className="text-white font-mono font-bold text-lg">ERC-721</div>
                  <div className="text-[#d1d5db] font-mono text-sm">Standard NFTs</div>
                </div>
                <div className="bg-[#1a1a1a] border-2 border-white p-4">
                  <div className="text-white font-mono font-bold text-lg">VOTING</div>
                  <div className="text-[#d1d5db] font-mono text-sm">Community Governance</div>
                </div>
                <div className="bg-[#1a1a1a] border-2 border-white p-4">
                  <div className="text-white font-mono font-bold text-lg">TIERS</div>
                  <div className="text-[#d1d5db] font-mono text-sm">Upgrade System</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid - CARV ID Implementation */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="my-16 md:my-24"
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl lg:text-4xl font-black tracking-[0.1em] text-white uppercase"
                style={{ textShadow: '2px_2px_0px_#666' }}
              >
                CARV ID Implementation Status
              </h2>
              <p className="text-[#d1d5db] mt-2 max-w-2xl mx-auto font-mono tracking-wide">
                MODULAR IDENTITY COMPONENTS • ACHIEVEMENT BINDING • DECENTRALIZED REPUTATION
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'MODULAR IDENTITY',
                  value: 'ERC-7231',
                  status: 'ACTIVE',
                },
                {
                  icon: Database,
                  title: 'ACHIEVEMENT BINDING',
                  value: 'GITHUB API',
                  status: 'CONNECTED',
                },
                {
                  icon: Network,
                  title: 'DECENTRALIZED VOTING',
                  value: 'POST VOTING',
                  status: 'ENABLED',
                },
                {
                  icon: Key,
                  title: 'REPUTATION NFT',
                  value: 'ERC-721',
                  status: 'DEPLOYED',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 2.4 + index * 0.15,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    y: -12,
                    rotate: index % 2 === 0 ? 1 : -1,
                    scale: 1.03,
                    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                  }}
                >
                  <Card
                    className="bg-black border-4 border-white shadow-[8px_8px_0px_0px_#666] 
                               hover:shadow-[12px_12px_0px_0px_#666] 
                               transition-all duration-400 ease-out group cursor-pointer"
                  >
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="w-16 h-16 bg-black border-3 border-white mx-auto mb-4 flex items-center justify-center 
                                   shadow-[4px_4px_0px_0px_#666] group-hover:shadow-[6px_6px_0px_0px_#666] 
                                   transition-all duration-300"
                        whileHover={{
                          rotate: 360,
                          scale: 1.1,
                          transition: {
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          },
                        }}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="font-mono font-black text-lg mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="font-mono text-2xl font-bold mb-1 text-white">
                        {item.value}
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge className="bg-white text-black font-mono text-xs px-2 py-1 border border-white shadow-[2px_2px_0px_0px_#666]">
                          {item.status}
                        </Badge>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Contract Status Section */}
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <ContractStatusChecker />
        </motion.div>

        {/* Team Passport Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <TeamPassport />
        </motion.div>

        {/* Relevant Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 1 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2
              className="text-3xl lg:text-4xl font-black tracking-[0.1em] text-white uppercase"
              style={{ textShadow: '2px_2px_0px_#666' }}
            >
              Relevant Links
            </h2>
            <p className="text-[#d1d5db] mt-2 max-w-2xl mx-auto font-mono tracking-wide">
              RESOURCES • DOCUMENTATION • TOOLS • COMMUNITY
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'YouTube',
                description: 'Video tutorials and demos',
                link: 'https://youtube.com/@mustafair',
                icon: Play
              },
              {
                title: 'GitHub',
                description: 'Source code and repositories',
                link: 'https://github.com/mustafair',
                icon: Github
              },
              {
                title: 'Documentation',
                description: 'API docs and guides and sdk',
                link: 'https://docs.mustafair.com',
                icon: BookOpen
              },
              {
                title: 'Tools',
                description: 'Development utilities',
                link: 'https://tools.mustafair.com',
                icon: Settings2
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 2.8 + index * 0.15,
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="bg-black border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-400 ease-out group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-black border-3 border-white mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_#666] group-hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-300">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-mono font-black text-lg mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="font-mono text-sm text-[#d1d5db] mb-3">
                        {item.description}
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge className="bg-white text-black font-mono text-xs px-2 py-1 border border-white shadow-[2px_2px_0px_0px_#666]">
                          VISIT
                        </Badge>
                      </motion.div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
  );
}
