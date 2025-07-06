"use client"

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';

interface ContractStatus {
  name: string;
  address: string;
  isDeployed: boolean;
  isLoading: boolean;
  error?: string;
}

const CONTRACT_ADDRESSES = {
  ModularCarvID: process.env.NEXT_PUBLIC_CARV_ID_CONTRACT || "0x59C3fed3153866A139e8efBA185da2BD083fF034",
  ReputationNFT: process.env.NEXT_PUBLIC_REPUTATION_NFT_CONTRACT || "0x4fC26333202DB03eeB5AFAd2A0e0218B726d2095"
};

export default function ContractStatusChecker() {
  const { isConnected, chainId } = useAccount();
  const [contracts, setContracts] = useState<ContractStatus[]>([
    { name: 'ModularCarvID', address: CONTRACT_ADDRESSES.ModularCarvID, isDeployed: false, isLoading: true },
    { name: 'ReputationNFT', address: CONTRACT_ADDRESSES.ReputationNFT, isDeployed: false, isLoading: true }
  ]);
  const [networkStatus, setNetworkStatus] = useState<'correct' | 'wrong' | 'unknown'>('unknown');

  useEffect(() => {
    checkNetworkStatus();
  }, [chainId, isConnected]);

  useEffect(() => {
    if (isConnected && networkStatus === 'correct') {
      checkContractDeployments();
    }
  }, [isConnected, networkStatus]);

  const checkNetworkStatus = () => {
    if (!isConnected) {
      setNetworkStatus('unknown');
      return;
    }

    if (chainId === 97 || chainId === 1337) { // BNB Testnet or Localhost
      setNetworkStatus('correct');
    } else {
      setNetworkStatus('wrong');
    }
  };

  const checkContractDeployments = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const updatedContracts = await Promise.all(
        contracts.map(async (contract) => {
          if (contract.address === "Not deployed yet") {
            return { ...contract, isLoading: false, isDeployed: false, error: "Contract not deployed" };
          }

          try {
            const code = await provider.getCode(contract.address);
            const isDeployed = code !== '0x';
            return { ...contract, isLoading: false, isDeployed, error: undefined };
          } catch (error: any) {
            return { ...contract, isLoading: false, isDeployed: false, error: error.message };
          }
        })
      );

      setContracts(updatedContracts);
    } catch (error: any) {
      console.error('Error checking contract deployments:', error);
      setContracts(prev => prev.map(contract => ({
        ...contract,
        isLoading: false,
        error: 'Failed to check deployment status'
      })));
    }
  };

  const getNetworkName = () => {
    if (chainId === 97) return 'BNB Testnet';
    if (chainId === 1337) return 'Localhost';
    return `Chain ID: ${chainId}`;
  };

  const getExplorerUrl = (address: string) => {
    if (chainId === 97) {
      return `https://testnet.bscscan.com/address/${address}`;
    }
    return null;
  };

  const StatusIcon = ({ contract }: { contract: ContractStatus }) => {
    if (contract.isLoading) return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    if (contract.isDeployed) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const StatusBadge = ({ contract }: { contract: ContractStatus }) => {
    if (contract.isLoading) return <Badge className="bg-blue-600 text-white font-mono">CHECKING...</Badge>;
    if (contract.isDeployed) return <Badge className="bg-green-600 text-white font-mono">DEPLOYED</Badge>;
    return <Badge className="bg-red-600 text-white font-mono">NOT DEPLOYED</Badge>;
  };

  return (
    <Card className="bg-black border-4 border-white shadow-[12px_12px_0px_0px_#666]">
      <CardHeader>
        <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
          <AlertCircle className="w-8 h-8" />
          CONTRACT DEPLOYMENT STATUS
        </CardTitle>
        <CardDescription className="text-[#d1d5db] font-mono">
          Check if smart contracts are deployed and ready for interaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Status */}
        <div className="space-y-3">
          <h3 className="text-xl font-black font-mono text-white tracking-wider">NETWORK STATUS</h3>
          {!isConnected ? (
            <Alert className="bg-yellow-600 border-yellow-600 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-mono">
                Please connect your wallet to check contract status
              </AlertDescription>
            </Alert>
          ) : networkStatus === 'wrong' ? (
            <Alert className="bg-red-600 border-red-600 text-white">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="font-mono">
                Wrong network! Please switch to BNB Testnet (Chain ID: 97). Currently on: {getNetworkName()}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-green-600 border-green-600 text-white">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-mono">
                Connected to {getNetworkName()} ✓
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Contract Status */}
        <div className="space-y-3">
          <h3 className="text-xl font-black font-mono text-white tracking-wider">SMART CONTRACTS</h3>
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div
                key={contract.name}
                className="bg-white text-black p-4 border-2 border-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <StatusIcon contract={contract} />
                  <div>
                    <div className="font-mono font-bold">{contract.name}</div>
                    <div className="font-mono text-sm text-gray-600">
                      {contract.address.length > 20 ? `${contract.address.slice(0, 6)}...${contract.address.slice(-4)}` : contract.address}
                    </div>
                    {contract.error && (
                      <div className="font-mono text-xs text-red-600">{contract.error}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <StatusBadge contract={contract} />
                  {contract.isDeployed && getExplorerUrl(contract.address) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(contract.address)!, '_blank')}
                      className="bg-black border-black text-white hover:bg-gray-800 font-mono text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      VIEW
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Instructions */}
        {contracts.some(c => !c.isDeployed) && (
          <div className="space-y-3">
            <h3 className="text-xl font-black font-mono text-white tracking-wider">DEPLOYMENT REQUIRED</h3>
            <Alert className="bg-yellow-600 border-yellow-600 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-mono space-y-2">
                <div>Some contracts are not deployed. Follow these steps:</div>
                <div className="bg-black text-white p-3 rounded font-mono text-sm">
                  <div>1. cd hardhat</div>
                  <div>2. npm install</div>
                  <div>3. npm run compile</div>
                  <div>4. npm run deploy</div>
                </div>
                <div>After deployment, refresh this page to see updated status.</div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Success Status */}
        {isConnected && networkStatus === 'correct' && contracts.every(c => c.isDeployed) && (
          <Alert className="bg-green-600 border-green-600 text-white">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="font-mono">
              🎉 All contracts are deployed and ready! You can now mint CARV IDs and Reputation NFTs.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={checkContractDeployments}
          disabled={!isConnected || networkStatus !== 'correct'}
          className="w-full bg-white text-black hover:bg-[#d1d5db] font-mono font-black tracking-wider py-3 shadow-[4px_4px_0px_0px_#666] hover:shadow-[6px_6px_0px_0px_#666] transition-all duration-200"
        >
          <Loader2 className={`w-5 h-5 mr-2 ${contracts.some(c => c.isLoading) ? 'animate-spin' : ''}`} />
          REFRESH STATUS
        </Button>
      </CardContent>
    </Card>
  );
}
