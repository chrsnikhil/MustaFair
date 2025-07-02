'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from './theme-provider';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { Button } from './ui/button';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmiConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <SessionProvider>
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'YOUR_PRIVY_APP_ID'}
            config={{
              loginMethods: [
                'wallet',
                'google',
                'discord',
                'github',
                'twitter',
                // Add more providers as needed: 'apple', 'linkedin', 'spotify', 'tiktok', 'instagram', 'line'
              ],
              embeddedWallets: {
                ethereum: {
                  createOnLogin: 'users-without-wallets',
                },
              },
              appearance: {
                theme: 'dark', // or 'light' or your custom color
                showWalletLoginFirst: true,
              },
            }}
          >
            <ThemeProvider attribute="class" defaultTheme="dark">
              {children}
            </ThemeProvider>
          </PrivyProvider>
        </SessionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export function LoginButton({ navStyle = false }: { navStyle?: boolean }) {
  const { ready, authenticated, logout } = usePrivy();
  const { login } = useLogin();
  const disableLogin = !ready || (ready && authenticated);

  if (authenticated) {
    return (
      <Button
        onClick={logout}
        className="bg-black text-white font-mono px-4 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[5px_5px_0px_0px_#666] transition-all duration-300 rounded-none text-xs tracking-widest"
        style={{ minWidth: 160 }}
      >
        DISCONNECT WALLET
      </Button>
    );
  }

  if (navStyle) {
    return (
      <Button
        onClick={() => login()}
        disabled={disableLogin}
        className="bg-black text-white font-mono px-4 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#666] hover:shadow-[5px_5px_0px_0px_#666] transition-all duration-300 rounded-none text-xs tracking-widest"
        style={{ minWidth: 160 }}
      >
        CONNECT WALLET
      </Button>
    );
  }

  return null;
}
