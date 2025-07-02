"use client";

import { useState } from "react";
import { keccak_256 } from "js-sha3";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import ModularCarvID_ABI_JSON from "@/lib/ModularCarvID_ABI.json";
const ModularCarvID_ABI = ModularCarvID_ABI_JSON.abi;

const CONTRACT_ADDRESS = "0x2FCF47444C97EE9c917d7351Cb0F7bC349CFBCaF";
const BNB_TESTNET_CHAIN_ID = 97;

export default function MintCarvIdDialog() {
  const { data: session, status } = useSession();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function getIdentityHash(user: any, wallet: string) {
    return "0x" + keccak_256(JSON.stringify({ ...user, wallet }));
  }

  async function handleMint(user: any) {
    if (!walletClient) return alert("Wallet not connected");
    if (chainId !== BNB_TESTNET_CHAIN_ID) {
      return;
    }
    setLoading(true);
    try {
      const identityHash = getIdentityHash(user, address!);
      const { ethers } = await import("ethers");
      const provider = window.ethereum;
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