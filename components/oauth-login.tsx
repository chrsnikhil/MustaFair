'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Github, Chrome, User, Hash, LogOut, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OAuthLoginProps {
  navStyle?: boolean;
  showIdentityHash?: boolean;
}

export function OAuthLogin({
  navStyle = false,
  showIdentityHash = false,
}: OAuthLoginProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button
        disabled
        className="bg-black text-white font-mono px-4 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#666] rounded-none text-xs tracking-widest animate-pulse"
      >
        LOADING...
      </Button>
    );
  }

  if (session) {
    if (navStyle) {
      return (
        <div className="flex items-center gap-3">
          <Badge className="bg-white text-black font-mono font-black tracking-wider border-2 border-white">
            {session.provider?.toUpperCase()}
          </Badge>
          <Button
            onClick={() => signOut()}
            className="bg-black text-white font-mono px-4 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[5px_5px_0px_0px_#666] transition-all duration-300 rounded-none text-xs tracking-widest"
          >
            <LogOut className="w-4 h-4 mr-2" />
            DISCONNECT
          </Button>
        </div>
      );
    }

    return (
      <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {session.provider === 'google' && (
                <Chrome className="w-5 h-5 text-white" />
              )}
              {session.provider === 'github' && (
                <Github className="w-5 h-5 text-white" />
              )}
              <div>
                <div className="text-white font-mono font-black tracking-wider">
                  {session.user?.name}
                </div>
                <div className="text-[#d1d5db] font-mono text-sm">
                  {session.user?.email}
                </div>
              </div>
            </div>
            <Badge className="bg-white text-black font-mono font-black tracking-wider">
              {session.provider?.toUpperCase()}
            </Badge>
          </div>

          {showIdentityHash && session.identityHash && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#333] border-2 border-white p-4 font-mono"
            >
              <div className="flex items-center gap-2 text-white mb-2">
                <Hash className="w-4 h-4" />
                <span className="font-black tracking-wider text-sm">
                  IDENTITY HASH
                </span>
              </div>
              <div className="text-[#d1d5db] break-all text-xs font-mono bg-black p-2 border border-[#666]">
                {session.identityHash}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[#d1d5db] text-xs">
                <Shield className="w-3 h-3" />
                <span>Ready for ERC-7231 contract binding</span>
              </div>
            </motion.div>
          )}

          <Button
            onClick={() => signOut()}
            className="w-full bg-black text-white font-mono font-bold tracking-wider border-2 border-[#666] hover:border-white transition-all duration-300 rounded-none"
          >
            <LogOut className="w-4 h-4 mr-2" />
            SIGN OUT
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (navStyle) {
    return (
      <Button
        onClick={() => signIn()}
        className="bg-black text-white font-mono px-4 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[5px_5px_0px_0px_#666] transition-all duration-300 rounded-none text-xs tracking-widest"
      >
        <User className="w-4 h-4 mr-2" />
        CONNECT IDENTITY
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => signIn('google')}
          className="w-full h-12 bg-white text-black font-mono font-black tracking-[0.1em] border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300 transform skew-x-1 rounded-none"
        >
          <Chrome className="w-5 h-5 mr-3" />
          CONNECT GOOGLE
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => signIn('github')}
          className="w-full h-12 bg-black text-white font-mono font-black tracking-[0.1em] border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300 transform skew-x-1 rounded-none"
        >
          <Github className="w-5 h-5 mr-3" />
          CONNECT GITHUB
        </Button>
      </motion.div>
    </div>
  );
}
