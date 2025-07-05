"use client";

import { useState } from "react";
import { keccak_256 } from "js-sha3";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import ModularCarvID_ABI_JSON from "@/lib/ModularCarvID_ABI.json";
const ModularCarvID_ABI = ModularCarvID_ABI_JSON.abi;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || "0x32A1BDa556796E7E62D37cffdAdFe4F06423fC6c" as `0x${string}`;
const BNB_TESTNET_CHAIN_ID = 97;
const LOCALHOST_CHAIN_ID = 1337;

export default function MintCarvIdDialog() {
  const { data: session, status } = useSession();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

  async function fetchWeb2Achievements(user: any) {
    try {
      const identities = [];
      
      // Add GitHub identity if user logged in with GitHub
      if (user.provider === 'github' && session?.username) {
        identities.push({ provider: 'github', username: session.username });
      }
      
      // Add Google identity if user logged in with Google
      if (user.provider === 'google' && user.email) {
        identities.push({ provider: 'google', email: user.email });
      }

      if (identities.length === 0) return null;

      const response = await fetch('/api/web2/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identities })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to fetch Web2 achievements:', error);
    }
    return null;
  }

  async function handleMint(user: any) {
    if (!walletClient) return alert("Wallet not connected");
    if (chainId !== BNB_TESTNET_CHAIN_ID && chainId !== LOCALHOST_CHAIN_ID) {
      return alert("Please switch to BNB Testnet or Localhost");
    }
    setLoading(true);
    try {
      // Fetch Web2 achievements before minting
      const web2Achievements = await fetchWeb2Achievements(user);
      
      const identityHash = getIdentityHash(user, address!, web2Achievements);
      const { ethers } = await import("ethers");
      const provider = (window as any).ethereum;
      if (!provider) throw new Error("No Ethereum provider found");
      
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ModularCarvID_ABI, signer);
      const tx = await contract.mintCarvId(identityHash);
      await tx.wait();
      setTxHash(tx.hash);
    } catch (err: any) {
      alert(err.message || err);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white font-black font-mono px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 tracking-wider">
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
              <Button variant="outline" onClick={() => disconnect()} className="w-full font-mono font-bold border-4 border-black">
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