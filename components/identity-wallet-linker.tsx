'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Link2,
  Hash,
  Wallet,
  User,
  Check,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { useIdentityWalletBinding } from '@/hooks/use-identity-wallet-binding';
import { toast } from 'sonner';

export function IdentityWalletLinker() {
  const {
    identityHash,
    walletAddress,
    isLinked,
    canLink,
    bindingMessage,
    linkIdentityToWallet,
    generateBindingMessage,
  } = useIdentityWalletBinding();

  const [isLinking, setIsLinking] = useState(false);

  const handleLink = async () => {
    if (!canLink) return;

    setIsLinking(true);
    try {
      const message = await linkIdentityToWallet();
      if (message) {
        toast.success(
          'Binding message generated! Ready for ERC-7231 contract.',
        );
        console.log('ERC-7231 binding message:', message);
      }
    } catch (error) {
      toast.error('Failed to generate binding: ' + (error as Error).message);
    } finally {
      setIsLinking(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666] hover:shadow-[16px_16px_0px_0px_#666] transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
          <Link2 className="w-6 h-6" />
          IDENTITY BINDING
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLinked ? (
              <Check className="w-6 h-6 text-white" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[#d1d5db]" />
            )}
            <span className="font-mono font-black text-white tracking-wider">
              {isLinked ? 'LINKED' : canLink ? 'READY TO LINK' : 'INCOMPLETE'}
            </span>
          </div>
          <Badge
            className={`font-mono font-black tracking-wider ${
              isLinked
                ? 'bg-white text-black'
                : canLink
                  ? 'bg-[#d1d5db] text-black'
                  : 'bg-[#666] text-white'
            }`}
          >
            ERC-7231
          </Badge>
        </div>

        {/* Identity Hash */}
        {identityHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#333] border-2 border-white p-4 font-mono"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white">
                <Hash className="w-4 h-4" />
                <span className="font-black tracking-wider text-sm">
                  IDENTITY HASH
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => copyToClipboard(identityHash, 'Identity hash')}
                className="bg-black text-white border border-white font-mono text-xs"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-[#d1d5db] break-all text-xs font-mono bg-black p-2 border border-[#666]">
              {identityHash}
            </div>
          </motion.div>
        )}

        {/* Wallet Address */}
        {walletAddress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#333] border-2 border-white p-4 font-mono"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white">
                <Wallet className="w-4 h-4" />
                <span className="font-black tracking-wider text-sm">
                  WALLET ADDRESS
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => copyToClipboard(walletAddress, 'Wallet address')}
                className="bg-black text-white border border-white font-mono text-xs"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-[#d1d5db] break-all text-xs font-mono bg-black p-2 border border-[#666]">
              {walletAddress}
            </div>
          </motion.div>
        )}

        {/* Binding Message */}
        {bindingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#333] border-2 border-white p-4 font-mono"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white">
                <Link2 className="w-4 h-4" />
                <span className="font-black tracking-wider text-sm">
                  BINDING MESSAGE
                </span>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  copyToClipboard(bindingMessage, 'Binding message')
                }
                className="bg-black text-white border border-white font-mono text-xs"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-[#d1d5db] break-all text-xs font-mono bg-black p-2 border border-[#666]">
              {bindingMessage}
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        {canLink && !isLinked && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleLink}
              disabled={isLinking}
              className="w-full h-12 bg-white text-black font-mono font-black tracking-[0.1em] border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[12px_12px_0px_0px_#666] transition-all duration-300 transform skew-x-1 rounded-none"
            >
              {isLinking
                ? 'GENERATING BINDING...'
                : 'GENERATE ERC-7231 BINDING'}
            </Button>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="bg-black border-2 border-[#666] p-4 font-mono text-xs text-[#d1d5db]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white"></div>
              <span>Connect both OAuth identity and Web3 wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white"></div>
              <span>Generate cryptographic binding message</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white"></div>
              <span>Submit to ERC-7231 contract for on-chain linking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white"></div>
              <span>Enable cross-platform reputation verification</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
