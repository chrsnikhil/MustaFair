"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, X } from "lucide-react";
import carvIdAbiData from "@/lib/ModularCarvID_ABI.json";
import { bscTestnet } from "wagmi/chains";

const contractAddress = "0x32A1BDa556796E7E62D37cffdAdFe4F06423fC6c";
const carvIdAbi = carvIdAbiData.abi;

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export function CarvIdPassportDialog() {
  const { address, isConnected, chain } = useAccount();
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  const isOnCorrectNetwork = chain?.id === bscTestnet.id;

  const { data: tokenId, error: tokenIdError, isFetching: isFetchingTokenId } = useReadContract({
    address: contractAddress,
    abi: carvIdAbi,
    functionName: "walletToTokenId",
    args: [address!],
    query: {
      enabled: isConnected && isOnCorrectNetwork,
    },
  });

  const hasToken = tokenId !== undefined && tokenId !== 0n;

  const { data: tokenURI, error: tokenURIError, isFetching: isFetchingTokenURI } = useReadContract({
    address: contractAddress,
    abi: carvIdAbi,
    functionName: "tokenURI",
    args: [tokenId!],
    query: {
      enabled: hasToken,
    },
  });

  useEffect(() => {
    const anyError = tokenIdError || tokenURIError;
    if (anyError) {
      setError(anyError.message);
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
        } else {
          setError("Unsupported token URI format.");
        }
      } catch (e) {
        setError(String(e));
      }
    }
    setIsLoading(isFetchingTokenId || isFetchingTokenURI);
  }, [tokenURI, tokenIdError, tokenURIError, isFetchingTokenId, isFetchingTokenURI]);

  // Button is only enabled if user is connected and has a CARV ID
  const canView = isConnected && isOnCorrectNetwork && hasToken;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-black text-white font-black font-mono px-6 py-2 border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] transition-all duration-300 tracking-wider text-base transform -skew-x-1"
          disabled={!canView}
        >
          View CARV ID
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
              <AlertDescription>{`${error}`}</AlertDescription>
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
              {/* Divider */}
              <div className="w-full border-t-2 border-[#333] my-1" />
              {/* Attributes Section */}
              <div className="w-full flex flex-wrap justify-center gap-2">
                {metadata.attributes && metadata.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="bg-black text-white border-2 border-white rounded px-3 py-1 font-mono text-xs font-bold tracking-wider shadow-[2px_2px_0px_0px_#666] flex flex-col items-center min-w-[80px]"
                  >
                    <span className="uppercase text-[#d1d5db] text-[10px] tracking-widest mb-0.5">{attr.trait_type}</span>
                    <span className="text-white text-xs font-mono">{attr.value}</span>
                  </div>
                ))}
              </div>
              {/* Divider */}
              <div className="w-full border-t-2 border-[#333] my-1" />
              {/* Footer Section */}
              <div className="w-full flex flex-col items-center gap-0.5 mt-1">
                <span className="text-xs font-mono text-[#999]">Token ID: <span className="font-bold text-white">{tokenId?.toString()}</span></span>
                <span className="text-xs font-mono text-[#999]">Wallet: <span className="font-bold text-white">{address?.slice(0, 6)}...{address?.slice(-4)}</span></span>
                <span className="text-xs font-mono text-[#999]">Network: <span className="font-bold text-white">BNB Testnet</span></span>
                {tokenId && (
                  <a
                    href={`https://testnet.bscscan.com/token/${contractAddress}?a=${tokenId.toString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block bg-white text-black font-black font-mono px-4 py-1 border-4 border-white shadow-[6px_6px_0px_0px_#666] hover:shadow-[8px_8px_0px_0px_#666] transition-all duration-300 tracking-wider text-xs transform -skew-x-1 rounded"
                  >
                    View on BscScan
                  </a>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
} 