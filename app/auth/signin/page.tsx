'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getProviders,
  signIn,
  getSession,
  ClientSafeProvider,
} from 'next-auth/react';
import { Github, Chrome, ArrowRight, Shield, Link2, Hash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const setAuthProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setAuthProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#333_1px,transparent_1px,transparent_8px,#333_9px,#333_10px,transparent_11px,transparent_18px)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(23deg,transparent_48%,#222_49%,#222_50%,transparent_52%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] opacity-70"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md mx-auto p-6"
      >
        <Card className="bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] hover:shadow-[24px_24px_0px_0px_#666] transition-all duration-500">
          <CardHeader className="text-center">
            <motion.div
              className="bg-white text-black px-6 py-3 font-mono font-black tracking-[0.2em] border-4 border-white shadow-[6px_6px_0px_0px_#666] transform -skew-x-2 mb-6 inline-block"
              whileHover={{ scale: 1.05 }}
            >
              MUSTAFAIR.SYS
            </motion.div>
            <CardTitle className="text-3xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center justify-center gap-4">
              <Shield className="w-8 h-8" />
              AUTHENTICATE
            </CardTitle>
            <p className="text-[#d1d5db] font-mono tracking-wide mt-4">
              Connect your identity to the decentralized reputation system
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Identity Hash Preview */}
            <motion.div
              className="bg-[#333] border-2 border-white p-4 font-mono text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-white mb-2">
                <Hash className="w-4 h-4" />
                <span className="font-black tracking-wider">
                  IDENTITY HASH PREVIEW
                </span>
              </div>
              <div className="text-[#d1d5db] break-all text-xs">
                Your OAuth identity will be cryptographically hashed for
                blockchain storage
              </div>
              <div className="flex items-center gap-2 mt-3 text-[#d1d5db]">
                <Link2 className="w-4 h-4" />
                <span className="text-xs">
                  Ready for ERC-7231 wallet linking
                </span>
              </div>
            </motion.div>

            {/* OAuth Providers */}
            <div className="space-y-4">
              {providers &&
                Object.values(providers).map(provider => {
                  const isGoogle = provider.id === 'google';
                  const isGitHub = provider.id === 'github';
                  const isLoading = loading === provider.id;

                  return (
                    <motion.div
                      key={provider.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => handleSignIn(provider.id)}
                        disabled={isLoading}
                        className={`w-full h-14 font-mono font-black tracking-[0.1em] border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300 transform skew-x-1 ${
                          isGoogle
                            ? 'bg-white text-black hover:bg-[#d1d5db]'
                            : 'bg-black text-white hover:bg-[#333]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-3 w-full">
                          {isGoogle && <Chrome className="w-6 h-6" />}
                          {isGitHub && <Github className="w-6 h-6" />}
                          <span className="flex-1 text-center">
                            {isLoading
                              ? 'CONNECTING...'
                              : `CONNECT ${provider.name.toUpperCase()}`}
                          </span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
            </div>

            {/* Security Notice */}
            <motion.div
              className="bg-black border-2 border-[#666] p-4 font-mono text-xs text-[#d1d5db]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>Zero-knowledge identity verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>Cryptographic hash generation for blockchain</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>ERC-7231 compatible identity linking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white"></div>
                  <span>Decentralized reputation binding</span>
                </div>
              </div>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="font-mono font-bold tracking-wider border-2 border-[#666] text-[#d1d5db] hover:border-white hover:text-white bg-transparent"
              >
                RETURN TO SYSTEM
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
