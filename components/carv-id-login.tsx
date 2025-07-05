"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useSignMessage } from "wagmi";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, LogOut, Shield, User } from "lucide-react";
import carvIdAbiData from "@/lib/ModularCarvID_ABI.json";
import { bscTestnet, localhost } from "wagmi/chains";

const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x32A1BDa556796E7E62D37cffdAdFe4F06423fC6c") as `0x${string}`;
const carvIdAbi = carvIdAbiData.abi;

interface CarvIdProfile {
  tokenId: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{ trait_type: string; value: string }>;
  };
  web2Achievements?: any;
}

export function CarvIdLogin() {
  const { address, isConnected, chain } = useAccount();
  const { data: session, status } = useSession();
  const { signMessageAsync } = useSignMessage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [carvIdProfile, setCarvIdProfile] = useState<CarvIdProfile | null>(null);

  const isOnCorrectNetwork = chain?.id === bscTestnet.id || chain?.id === localhost.id;

  // Check if user has a CARV ID
  const { data: tokenId, error: tokenIdError } = useReadContract({
    address: contractAddress,
    abi: carvIdAbi,
    functionName: "walletToTokenId",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && isOnCorrectNetwork && !!address,
    },
  });

  const hasToken = tokenId !== undefined && tokenId !== null && Number(tokenId) > 0;

  // Get token URI for metadata
  const { data: tokenURI } = useReadContract({
    address: contractAddress,
    abi: carvIdAbi,
    functionName: "tokenURI",
    args: hasToken && tokenId ? [tokenId] : undefined,
    query: {
      enabled: hasToken,
    },
  });

  // Parse metadata when tokenURI is available
  useEffect(() => {
    if (tokenURI && hasToken) {
      try {
        const uriString = tokenURI as string;
        if (uriString.startsWith("data:application/json;base64,")) {
          const base64String = uriString.substring(29);
          const jsonString = atob(base64String);
          const metadata = JSON.parse(jsonString);
          
          setCarvIdProfile({
            tokenId: String(tokenId),
            metadata,
          });
        }
      } catch (e) {
        console.error("Failed to parse token URI:", e);
      }
    }
  }, [tokenURI, hasToken, tokenId]);

  // Fetch Web2 achievements for the profile
  useEffect(() => {
    if (carvIdProfile && address) {
      fetchWeb2Achievements();
    }
  }, [carvIdProfile, address]);

  const fetchWeb2Achievements = async () => {
    try {
      const response = await fetch('/api/web2/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identities: [
            { provider: 'github', username: 'demo' },
            { provider: 'google', email: 'demo@example.com' }
          ]
        })
      });

      if (response.ok) {
        const achievements = await response.json();
        setCarvIdProfile(prev => prev ? { ...prev, web2Achievements: achievements } : null);
      }
    } catch (error) {
      console.warn('Failed to fetch Web2 achievements:', error);
    }
  };

  const handleCarvIdLogin = async () => {
    if (!address || !hasToken || !carvIdProfile) return;

    setIsLoading(true);
    setError("");

    try {
      // Create a message to sign for authentication
      const loginMessage = `Login to MustaFair with CARV ID #${carvIdProfile.tokenId}\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      
      // Sign the message
      const signature = await signMessageAsync({ message: loginMessage });

      // Authenticate with our custom CARV ID provider
      const result = await signIn('carv-id', {
        address,
        tokenId: carvIdProfile.tokenId,
        signature,
        message: loginMessage,
        metadata: JSON.stringify(carvIdProfile.metadata),
        web2Achievements: JSON.stringify(carvIdProfile.web2Achievements),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with CARV ID");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setCarvIdProfile(null);
  };

  // If already logged in with CARV ID, show profile
  if (session?.provider === 'carv-id') {
    return (
      <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
            <Shield className="w-6 h-6" />
            CARV ID LOGIN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[#333] border-2 border-white">
            <User className="w-5 h-5 text-white" />
            <div>
              <p className="font-mono text-white font-bold">
                Logged in as: {session.user?.name || `CARV ID #${(session as any).tokenId}`}
              </p>
              <p className="font-mono text-[#d1d5db] text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            className="w-full bg-white text-black font-black font-mono border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
      <CardHeader>
        <CardTitle className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
          <Shield className="w-6 h-6" />
          CARV ID LOGIN
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="border-2 border-red-500">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <div className="text-center p-4 border-2 border-[#666] bg-[#222]">
            <p className="font-mono text-[#d1d5db] mb-2">Connect your wallet to login with CARV ID</p>
          </div>
        ) : !isOnCorrectNetwork ? (
          <div className="text-center p-4 border-2 border-[#666] bg-[#222]">
            <p className="font-mono text-[#d1d5db] mb-2">Switch to BNB Testnet or Localhost</p>
          </div>
        ) : !hasToken ? (
          <div className="text-center p-4 border-2 border-[#666] bg-[#222]">
            <p className="font-mono text-[#d1d5db] mb-2">No CARV ID found for this wallet</p>
            <p className="font-mono text-[#999] text-sm">Mint a CARV ID to enable universal login</p>
          </div>
        ) : carvIdProfile ? (
          <div className="space-y-4">
            <div className="p-4 border-2 border-white bg-[#333]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-black border-2 border-white rounded flex items-center justify-center">
                  <img 
                    src={carvIdProfile.metadata.image} 
                    alt={carvIdProfile.metadata.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </div>
                <div>
                  <h3 className="font-mono text-white font-bold">{carvIdProfile.metadata.name}</h3>
                  <p className="font-mono text-[#d1d5db] text-sm">Token ID: #{carvIdProfile.tokenId}</p>
                </div>
              </div>
              
              {carvIdProfile.web2Achievements && (
                <div className="mt-3 pt-3 border-t border-[#666]">
                  <p className="font-mono text-[#d1d5db] text-xs mb-1">Web2 Score: {carvIdProfile.web2Achievements.totalScore}</p>
                  <p className="font-mono text-[#d1d5db] text-xs">Tier: {carvIdProfile.web2Achievements.overallTier}</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleCarvIdLogin}
              disabled={isLoading}
              className="w-full bg-white text-black font-black font-mono border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login with CARV ID
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center p-4 border-2 border-[#666] bg-[#222]">
            <p className="font-mono text-[#d1d5db] mb-2">Loading CARV ID...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
