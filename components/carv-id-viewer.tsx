"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useSession } from "next-auth/react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, X } from "lucide-react";
import carvIdAbiData from "@/lib/ModularCarvID_ABI.json";
import { bscTestnet, localhost } from "wagmi/chains";
import { useWeb2Achievements } from "@/hooks/use-web2-achievements";
import { ethers } from "ethers";

// Ensure the contract address is properly typed
const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x59C3fed3153866A139e8efBA185da2BD083fF034") as `0x${string}`;
const carvIdAbi = carvIdAbiData.abi; // Use just the ABI array

// Debug environment variable
console.log('🔍 CarvIdPassportDialog - Environment variable check:', {
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  contractAddress,
  hasEnvVar: !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
});

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export function CarvIdPassportDialog() {
  const { address, isConnected, chain } = useAccount();
  const { data: session } = useSession();
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [web2Profile, setWeb2Profile] = useState<any>(null);
  const [web2Loading, setWeb2Loading] = useState(false);
  const [web2Error, setWeb2Error] = useState<string | null>(null);
  const [trustScore, setTrustScore] = useState<{ value: number; badge: string; explanation: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  const isOnCorrectNetwork = chain?.id === bscTestnet.id || chain?.id === localhost.id;

  const { data: tokenId, error: tokenIdError, isFetching: isFetchingTokenId } = useReadContract({
    address: contractAddress,
    abi: carvIdAbi,
    functionName: "walletToTokenId",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && isOnCorrectNetwork && !!address,
    },
  });

  // Check if user has a token - fix the logic to handle BigInt properly
  const hasToken = tokenId !== undefined && tokenId !== null && Number(tokenId) > 0;

  // Enhanced debugging for CARV ID detection
  useEffect(() => {
    if (isConnected && isOnCorrectNetwork && address) {
      console.log('🔍 CARV ID Detection Debug:', {
        address,
        contractAddress,
        functionName: 'walletToTokenId',
        args: [address],
        enabled: isConnected && isOnCorrectNetwork && !!address,
        network: chain?.id === localhost.id ? 'Localhost' : 'BNB Testnet',
        chainId: chain?.id,
        tokenId: tokenId ? String(tokenId) : null,
        hasToken,
        tokenIdError
      });
      
      // Check if contract is deployed
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        provider.getCode(contractAddress).then((code: string) => {
          console.log('📋 Contract Deployment Check:', {
            contractAddress,
            hasCode: code !== '0x',
            codeLength: code.length,
            isDeployed: code !== '0x'
          });
        }).catch((error: any) => {
          console.error('❌ Contract deployment check failed:', error);
        });
      }
    }
  }, [isConnected, isOnCorrectNetwork, address, contractAddress, chain, tokenId, hasToken, tokenIdError]);

  // ABI validation debugging
  useEffect(() => {
    console.log('🔧 ABI Validation Debug:', {
      abiLength: carvIdAbi.length,
      hasWalletToTokenId: carvIdAbi.some((item: any) => 
        typeof item === 'object' && item.name === 'walletToTokenId'
      ),
      hasTokenURI: carvIdAbi.some((item: any) => 
        typeof item === 'object' && item.name === 'tokenURI'
      ),
      // Show sample of ABI functions
      abiFunctions: carvIdAbi
        .filter((item: any) => typeof item === 'object' && item.type === 'function')
        .slice(0, 10)
        .map((item: any) => item.name)
    });
  }, []);

  const { data: tokenURI, error: tokenURIError, isFetching: isFetchingTokenURI } = useReadContract({
    address: contractAddress,
    abi: carvIdAbi,
    functionName: "tokenURI",
    args: hasToken && tokenId ? [tokenId] : undefined,
    query: {
      enabled: hasToken,
    },
  });

  // Set client flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const anyError = tokenIdError || tokenURIError;
    if (anyError) {
      console.error('❌ CARV ID Error:', anyError);
      setError(String(anyError.message));
      setIsLoading(false);
      return;
    }
    if (tokenURI) {
      try {
        const uriString = tokenURI as string;
        if (uriString.startsWith("data:application/json;base64,")) {
          const base64String = uriString.substring(29);
          const jsonString = atob(base64String);
          const parsedMetadata = JSON.parse(jsonString);
          setMetadata(parsedMetadata);
          console.log('✅ CARV ID Metadata loaded:', parsedMetadata);
        } else {
          setError("Unsupported token URI format.");
        }
      } catch (e) {
        console.error('❌ Failed to parse token URI:', e);
        setError(String(e));
      }
    }
    setIsLoading(isFetchingTokenId || isFetchingTokenURI);
  }, [tokenURI, tokenIdError, tokenURIError, isFetchingTokenId, isFetchingTokenURI]);

  // Fetch Web2 achievements when modal opens and address is available
  useEffect(() => {
    if (address && open) {
      setWeb2Loading(true);
      setWeb2Error(null);
      
      // Create identities array from session data
      const identities = [];
      
      // Add GitHub identity if user is logged in with GitHub
      if (session?.user && (session as any).provider === 'github' && (session as any).username) {
        identities.push({ provider: 'github', username: (session as any).username });
      }
      
      // Add Google identity if user is logged in with Google
      if (session?.user && (session as any).provider === 'google' && session.user.email) {
        identities.push({ provider: 'google', email: session.user.email });
      }
      
      // If no session data, use demo data
      if (identities.length === 0) {
        identities.push({ provider: 'github', username: 'demo' });
        identities.push({ provider: 'google', email: 'demo@example.com' });
      }
      
      // Fetch Web2 achievements
      fetch('/api/web2/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identities })
      })
        .then(res => res.json())
        .then(data => {
          setWeb2Profile(data);
          setWeb2Loading(false);
        })
        .catch(() => {
          setWeb2Error('Failed to fetch Web2 achievements');
          setWeb2Loading(false);
        });
    }
  }, [address, open, session]);

  // Compute trust score based on Web2 achievements and metadata
  useEffect(() => {
    if (web2Profile || metadata) {
      let score = 30; // Base score
      let badge = "New User";
      let explanation = "Base score for CARV ID holder.";
      
      // Add score from Web2 achievements
      if (web2Profile && web2Profile.totalScore) {
        score += Math.min(web2Profile.totalScore / 10, 50); // Scale achievements score
        explanation += ` Web2 achievements: ${web2Profile.totalScore} pts.`;
        
        if (web2Profile.overallTier === 'Gold') {
          score += 20;
          explanation += " Gold tier bonus.";
        } else if (web2Profile.overallTier === 'Silver') {
          score += 10;
          explanation += " Silver tier bonus.";
        }
      }
      
      // Add score from NFT metadata
      if (metadata && metadata.attributes) {
        const hasNFTs = metadata.attributes.find(a => a.trait_type === "NFTs");
        if (hasNFTs) {
          score += 10;
          explanation += " NFT activity detected.";
        }
      }
      
      // Determine badge based on score
      if (score > 90) badge = "Trusted";
      else if (score > 70) badge = "Active";
      else if (score > 50) badge = "Verified";
      
      setTrustScore({ value: Math.round(score), badge, explanation });
    }
  }, [web2Profile, metadata]);

  // Button is only enabled if user is connected and has a CARV ID
  const canView = isConnected && isOnCorrectNetwork && hasToken;

  // Get button text and tooltip based on state - only on client side
  const getButtonState = () => {
    if (!isClient) {
      return { text: "Loading...", disabled: true };
    }
    if (!isConnected) {
      return { text: "Connect Wallet First", disabled: true };
    }
    if (!isOnCorrectNetwork) {
      return { text: "Switch to BNB Testnet/Localhost", disabled: true };
    }
    if (!hasToken) {
      return { text: "Mint CARV ID First", disabled: true };
    }
    return { text: "View CARV ID", disabled: false };
  };

  const buttonState = getButtonState();

  // Don't render the button until client-side hydration is complete
  if (!isClient) {
    return (
      <Button
        className="bg-black text-white font-black font-mono px-6 py-2 border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 hover:text-black transition-all duration-300 tracking-wider text-base transform -skew-x-1"
        disabled={true}
      >
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-black text-white font-black font-mono px-6 py-2 border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] transition-all duration-300 tracking-wider text-base transform -skew-x-1"
          disabled={buttonState.disabled}
          title={buttonState.disabled ? buttonState.text : "View your CARV ID passport"}
        >
          {buttonState.text}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full bg-black border-4 border-white shadow-[20px_20px_0px_0px_#666] p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="bg-black text-white px-8 py-4 border-b-4 border-white flex flex-col items-center relative">
          <DialogTitle className="text-2xl font-black font-mono tracking-[0.1em] transform -skew-x-1">
            DIGITAL PASSPORT
          </DialogTitle>
          <span className="text-xs font-mono tracking-widest mt-1">CARV IDENTITY</span>
          <DialogClose asChild>
            <Button
              size="icon"
              className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-white text-black border-2 border-black shadow-[3px_3px_0px_0px_#666] hover:bg-[#e8e8e8] focus:outline-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="p-5 flex flex-col items-center gap-4 bg-black overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <Skeleton className="h-36 w-36 rounded-md border-4 border-white shadow-[12px_12px_0px_0px_#666]" />
              <Skeleton className="h-5 w-28 shadow-[4px_4px_0px_0px_#666]" />
              <Skeleton className="h-4 w-40 shadow-[2px_2px_0px_0px_#666]" />
              <Skeleton className="h-4 w-40 shadow-[2px_2px_0px_0px_#666]" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="w-full shadow-[6px_6px_0px_0px_#666] border-2 border-black">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading CARV ID</AlertTitle>
              <AlertDescription>{String(error)}</AlertDescription>
            </Alert>
          ) : metadata ? (
            <div className="w-full flex flex-col items-center gap-4">
              {/* Image Section */}
              <div className="w-32 h-32 rounded-md border-4 border-white bg-black shadow-[12px_12px_0px_0px_#666] overflow-hidden flex items-center justify-center">
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full h-full object-cover"
                  style={{ background: '#222' }}
                />
              </div>
              {/* Info Section */}
              <div className="w-full text-center flex flex-col items-center gap-1">
                <h2 className="text-xl font-black font-mono text-white tracking-wider transform -skew-x-1 shadow-[2px_2px_0px_0px_#666] inline-block px-3 py-1 bg-black border-2 border-white rounded">
                  {metadata.name}
                </h2>
                <p className="text-sm font-mono text-[#d1d5db] tracking-wide shadow-[1px_1px_0px_0px_#666] inline-block px-3 py-1 bg-[#222] border border-white rounded max-w-xs">
                  {metadata.description}
                </p>
              </div>
              {/* Web2 Achievements Section */}
              {web2Loading ? (
                <Skeleton className="h-6 w-40" />
              ) : web2Profile && typeof web2Profile === 'object' ? (
                <div className="w-full text-center flex flex-col items-center gap-2">
                  <h3 className="text-xs font-mono text-[#d1d5db] tracking-widest mb-1">Web2 Achievements</h3>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-mono text-white">
                      Total Score: <span className="font-bold">{web2Profile.totalScore || 0}</span>
                    </div>
                    <div className="text-xs text-[#d1d5db]">
                      Tier: <span className="font-bold text-white">{web2Profile.overallTier || 'Bronze'}</span>
                    </div>
                    {web2Profile.combinedBadges && web2Profile.combinedBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-1">
                        {web2Profile.combinedBadges.slice(0, 3).map((badge: string, index: number) => (
                          <span key={index} className="text-xs bg-[#222] border border-white rounded px-2 py-1">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                    {web2Profile.providers && web2Profile.providers.length > 0 && (
                      <div className="text-xs text-[#999] mt-1">
                        {web2Profile.providers.map((p: any, index: number) => (
                          <div key={index}>
                            {p.provider}: {p.achievements?.score || 0} pts
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#999]">No Web2 achievements found.</div>
              )}
              {/* Divider */}
              <div className="w-full border-t-2 border-[#333] my-1" />
              {/* Trust Score Section */}
              {trustScore && (
                <div className="w-full text-center flex flex-col items-center gap-1">
                  <h3 className="text-xs font-mono text-[#d1d5db] tracking-widest mb-1">Trust Score</h3>
                  <span className="text-lg font-black text-white">{trustScore.value}/100 <span className="ml-2 text-xs bg-[#222] border border-white rounded px-2">{trustScore.badge}</span></span>
                  <span className="text-xs text-[#999]">{trustScore.explanation}</span>
                </div>
              )}
              {/* Divider */}
              <div className="w-full border-t-2 border-[#333] my-1" />
              {/* Footer Section */}
              <div className="w-full flex flex-col items-center gap-0.5 mt-1">
                <span className="text-xs font-mono text-[#999]">
                  Token ID: <span className="font-bold text-white">{tokenId ? String(tokenId) : 'N/A'}</span>
                </span>
                <span className="text-xs font-mono text-[#999]">
                  Wallet: <span className="font-bold text-white">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </span>
                <span className="text-xs font-mono text-[#999]">
                  Network: <span className="font-bold text-white">{chain?.id === localhost.id ? 'Localhost' : 'BNB Testnet'}</span>
                </span>
                {tokenId ? (
                  <a
                    href={chain?.id === localhost.id 
                      ? `http://localhost:8545` 
                      : `https://testnet.bscscan.com/token/${contractAddress}?a=${String(tokenId)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block bg-white text-black font-black font-mono px-4 py-1 border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] transition-all duration-300 tracking-wider text-xs transform -skew-x-1 rounded"
                  >
                    {chain?.id === localhost.id ? 'View on Localhost' : 'View on BscScan'}
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#999]">No CARV ID found.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 