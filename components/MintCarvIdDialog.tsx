"use client";

import { useState, useEffect } from "react";
import { keccak_256 } from "js-sha3";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import ModularCarvID_ABI from "@/lib/ModularCarvID_ABI.json";
import { useWeb2Achievements } from "@/hooks/use-web2-achievements";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const BNB_TESTNET_CHAIN_ID = 97;
const LOCALHOST_CHAIN_ID = 1337;

// Ensure ABI is properly extracted as an array
const carvIdAbi = Array.isArray(ModularCarvID_ABI) ? ModularCarvID_ABI : ModularCarvID_ABI.abi;

// Debug ABI structure
console.log('🔧 MintCarvIdDialog ABI Debug:', {
  isArray: Array.isArray(ModularCarvID_ABI),
  hasAbi: 'abi' in ModularCarvID_ABI,
  abiType: typeof carvIdAbi,
  abiLength: Array.isArray(carvIdAbi) ? carvIdAbi.length : 'not array'
});

export default function MintCarvIdDialog() {
  const { data: session, status } = useSession();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { achievements: web2Achievements } = useWeb2Achievements();

  // Ensure client-side rendering to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  function getIdentityHash(user: any, wallet: string, web2Achievements?: any) {
    const identityData = {
      ...user,
      wallet,
      web2Achievements: web2Achievements ? {
        totalScore: web2Achievements.totalScore,
        overallTier: web2Achievements.overallTier,
        achievementHash: web2Achievements.achievementHash,
        providers: web2Achievements.providers?.map((p: any) => ({
          provider: p.provider,
          score: p.achievements.score,
          tier: p.achievements.tier
        })),
        badges: web2Achievements.combinedBadges,
        lastUpdated: web2Achievements.metadata.lastUpdated
      } : null
    };
    return "0x" + keccak_256(JSON.stringify(identityData));
  }

  async function handleMint(user: any) {
    if (!isClient) return; // Prevent execution during SSR

    if (!walletClient) {
      toast.error("WALLET NOT CONNECTED", {
        description: "Please connect your wallet to mint CARV ID",
        icon: <XCircle className="w-5 h-5" />,
        style: {
          background: '#000',
          border: '4px solid #fff',
          color: '#fff',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
        className: "font-mono tracking-wider",
      });
      return;
    }
    
    if (chainId !== BNB_TESTNET_CHAIN_ID && chainId !== LOCALHOST_CHAIN_ID) {
      toast.error("WRONG NETWORK", {
        description: "Please switch to BNB Testnet or Localhost",
        icon: <AlertTriangle className="w-5 h-5" />,
        style: {
          background: '#000',
          border: '4px solid #fff',
          color: '#fff',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
        className: "font-mono tracking-wider",
      });
      return;
    }
    
    setLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading("MINTING CARV ID...", {
      description: "Processing transaction on blockchain",
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      style: {
        background: '#000',
        border: '4px solid #fff',
        color: '#fff',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
      className: "font-mono tracking-wider",
    });
    
    try {
      // Fetch Web2 achievements before minting
      const identityHash = getIdentityHash(user, address!, web2Achievements);
      const { ethers } = await import("ethers");
      const provider = (window as any).ethereum;
      if (!provider) throw new Error("No Ethereum provider found");
      
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      
      // Check if contract is deployed
      const code = await ethersProvider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        throw new Error(`Contract not deployed at address ${CONTRACT_ADDRESS}. Please deploy the ModularCarvID contract first using 'cd hardhat && npm run deploy'`);
      }
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, carvIdAbi, signer);
      
      // Check if user already has a CARV ID
      try {
        const tokenId = await contract.walletToTokenId(address);
        if (tokenId && tokenId.toString() !== '0') {
          throw new Error("You already have a CARV ID minted!");
        }
      } catch (err: any) {
        // If the function doesn't exist or other error, continue with minting
        if (!err.message.includes("already have a CARV ID")) {
          console.warn("Could not check existing CARV ID:", err.message);
        } else {
          throw err;
        }
      }
      
      console.log("Minting CARV ID with identity hash:", identityHash);
      const tx = await contract.mintCarvId(identityHash);
      console.log("Transaction submitted:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      setTxHash(tx.hash);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("CARV ID MINTED SUCCESSFULLY!", {
        description: `Transaction: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
        icon: <CheckCircle className="w-5 h-5" />,
        style: {
          background: '#000',
          border: '4px solid #fff',
          color: '#fff',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
        className: "font-mono tracking-wider",
        duration: 5000,
      });
      
      // Store Web2 achievements on-chain if available
      if (web2Achievements && web2Achievements.achievementHash) {
        try {
          console.log("Updating Web2 achievements...");
          const updateTx = await contract.updateWeb2Achievements(
            web2Achievements.achievementHash,
            web2Achievements.overallTier || 'Bronze'
          );
          await updateTx.wait();
          console.log("Web2 achievements updated:", updateTx.hash);
          
          toast.success("WEB2 ACHIEVEMENTS UPDATED", {
            description: "Your achievements have been bound to your CARV ID",
            icon: <Shield className="w-5 h-5" />,
            style: {
              background: '#000',
              border: '4px solid #fff',
              color: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            },
            className: "font-mono tracking-wider",
          });
        } catch (updateErr: any) {
          console.warn("Could not update Web2 achievements:", updateErr.message);
          toast.error("WEB2 UPDATE FAILED", {
            description: "Achievements could not be updated, but CARV ID was minted",
            icon: <AlertTriangle className="w-5 h-5" />,
            style: {
              background: '#000',
              border: '4px solid #fff',
              color: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            },
            className: "font-mono tracking-wider",
          });
        }
      }
      
    } catch (err: any) {
      console.error("Minting error:", err);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error("MINTING FAILED", {
        description: err.message || "Failed to mint CARV ID. Please try again.",
        icon: <XCircle className="w-5 h-5" />,
        style: {
          background: '#000',
          border: '4px solid #fff',
          color: '#fff',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
        className: "font-mono tracking-wider",
        duration: 5000,
      });
    }
    setLoading(false);
  }

  // Extract user info from session
  const user = session?.user && session.provider
    ? {
        provider: session.provider,
        id: session.user.email, // fallback to email as unique id
        email: session.user.email,
        username: session.username,
      }
    : null;

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <Button 
        className="bg-black text-white font-black font-mono px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 tracking-wider"
        disabled={true}
      >
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white font-black font-mono px-8 py-4 border-2 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 tracking-wider transform -skew-x-1">
          Mint Modular CARV ID
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#f5f5f5] border-4 border-black shadow-[20px_20px_0px_0px_#000000]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black font-mono text-black tracking-[0.1em] transform -skew-x-1">
            Mint Your Modular CARV ID
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {status === "loading" ? (
            <div className="font-mono text-black">Loading user info...</div>
          ) : !user ? (
            <div className="font-mono text-black">Please log in with Google or GitHub to mint your CARV ID.</div>
          ) : !isConnected ? (
            <Button onClick={() => connectors && connectors[0] && connect({ connector: connectors[0] })} className="w-full bg-black text-white font-mono font-bold border-4 border-black">
              Connect Wallet
            </Button>
          ) : (
            <>
              <div className="font-mono text-black">
                <div>
                  <span className="font-bold">Wallet:</span> {address}
                </div>
                <div>
                  <span className="font-bold">Provider:</span> {user.provider}
                </div>
                <div>
                  <span className="font-bold">Email:</span> {user.email}
                </div>
                {user.username && (
                  <div>
                    <span className="font-bold">Username:</span> {user.username}
                  </div>
                )}
                <div className="mt-2 p-2 bg-green-100 border border-green-500 rounded">
                  <div className="text-sm font-bold text-green-800">✓ Web2 Achievements Integration</div>
                  <div className="text-xs text-green-700">
                    Your {user.provider} achievements will be included in the CARV ID metadata
                  </div>
                </div>
              </div>
              {chainId !== undefined && chainId !== BNB_TESTNET_CHAIN_ID && (
                <div className="font-mono text-red-700">Please switch to BNB Testnet in your wallet.</div>
              )}
              <Button onClick={() => handleMint(user)} disabled={loading} className="w-full bg-black text-white font-mono font-bold border-4 border-black">
                {loading ? "Minting..." : "Mint CARV ID"}
              </Button>
              {txHash && (
                <div className="font-mono text-green-700">
                  Minted! View on{" "}
                  <a
                    href={`https://testnet.bscscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    BscScan
                  </a>
                </div>
              )}
              <Button variant="outline" onClick={() => disconnect()} className="w-full font-mono font-bold border-4 border-black transform -skew-x-1 hover:text-black transition-all duration-300">
                Disconnect Wallet
              </Button>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="font-mono font-bold border-4 border-black">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 