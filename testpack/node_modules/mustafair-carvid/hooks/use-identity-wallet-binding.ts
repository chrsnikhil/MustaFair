'use client';

import { useSession } from 'next-auth/react';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { createBindingMessage } from '@/lib/identity-hash';

export interface IdentityWalletBinding {
  identityHash?: string;
  walletAddress?: string;
  isLinked: boolean;
  canLink: boolean;
  bindingMessage?: string;
}

/**
 * Hook for managing identity and wallet linking for ERC-7231 compatibility
 */
export function useIdentityWalletBinding(): IdentityWalletBinding & {
  linkIdentityToWallet: () => Promise<string | null>;
  generateBindingMessage: () => string | null;
} {
  const { data: session } = useSession();
  const { user, authenticated } = usePrivy();
  const [bindingState, setBindingState] = useState<IdentityWalletBinding>({
    isLinked: false,
    canLink: false,
  });

  useEffect(() => {
    const identityHash = session?.identityHash;
    const walletAddress = user?.wallet?.address;

    const newState: IdentityWalletBinding = {
      identityHash,
      walletAddress,
      isLinked: !!(identityHash && walletAddress),
      canLink: !!(identityHash && walletAddress),
      bindingMessage:
        identityHash && walletAddress
          ? createBindingMessage(identityHash, walletAddress)
          : undefined,
    };

    setBindingState(newState);
  }, [session, user, authenticated]);

  const generateBindingMessage = (): string | null => {
    if (!bindingState.identityHash || !bindingState.walletAddress) {
      return null;
    }
    return createBindingMessage(
      bindingState.identityHash,
      bindingState.walletAddress,
    );
  };

  const linkIdentityToWallet = async (): Promise<string | null> => {
    if (!bindingState.canLink) {
      throw new Error('Cannot link: missing identity or wallet');
    }

    // Generate the binding message that would be signed for ERC-7231
    const message = generateBindingMessage();
    if (!message) {
      throw new Error('Failed to generate binding message');
    }

    // In a real implementation, this would:
    // 1. Sign the message with the wallet
    // 2. Submit the signature to the ERC-7231 contract
    // 3. Store the binding on-chain

    // For now, we return the message that would be signed
    console.log('Binding message for ERC-7231:', message);
    console.log('Identity hash:', bindingState.identityHash);
    console.log('Wallet address:', bindingState.walletAddress);

    return message;
  };

  return {
    ...bindingState,
    linkIdentityToWallet,
    generateBindingMessage,
  };
}
