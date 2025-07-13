"use client"

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink, Server, Shield, Zap } from 'lucide-react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

interface ContractStatus {
  name: string;
  address: string;
  isDeployed: boolean;
  isLoading: boolean;
  error?: string;
}

const CONTRACT_ADDRESSES = {
  ModularCarvID: process.env.NEXT_PUBLIC_CARV_ID_CONTRACT || "Not deployed yet",
  ReputationNFT: process.env.NEXT_PUBLIC_REPUTATION_NFT_CONTRACT || "0x4fC26333202DB03eeB5AFAd2A0e0218B726d2095"
};

export default function ContractStatusChecker() {
  const { isConnected, chainId } = useAccount();
  const [contracts, setContracts] = useState<ContractStatus[]>([
    { name: 'ModularCarvID', address: CONTRACT_ADDRESSES.ModularCarvID, isDeployed: false, isLoading: true },
    { name: 'ReputationNFT', address: CONTRACT_ADDRESSES.ReputationNFT, isDeployed: false, isLoading: true }
  ]);
  const [networkStatus, setNetworkStatus] = useState<'correct' | 'wrong' | 'unknown'>('unknown');
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    checkNetworkStatus();
  }, [chainId, isConnected, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (isConnected && networkStatus === 'correct') {
      checkContractDeployments();
    }
  }, [isConnected, networkStatus, isClient]);

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
    if (contract.isLoading) return <Loader2 className="w-6 h-6 animate-spin text-white" />;
    if (contract.isDeployed) return <CheckCircle className="w-6 h-6 text-green-400" />;
    return <XCircle className="w-6 h-6 text-red-400" />;
  };

  const StatusBadge = ({ contract }: { contract: ContractStatus }) => {
    if (contract.isLoading) return <Badge className="bg-blue-600 text-white font-mono font-bold tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#666]">CHECKING...</Badge>;
    if (contract.isDeployed) return <Badge className="bg-green-600 text-white font-mono font-bold tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#666]">DEPLOYED</Badge>;
    return <Badge className="bg-red-600 text-white font-mono font-bold tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#666]">NOT DEPLOYED</Badge>;
  };

  return (
    <Card className="bg-black border-4 border-white shadow-[16px_16px_0px_0px_#666] hover:shadow-[20px_20px_0px_0px_#666] transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-4">
          <Server className="w-8 h-8" />
          CONTRACT DEPLOYMENT STATUS
        </CardTitle>
        <CardDescription className="text-[#d1d5db] font-mono tracking-wide">
          Check if smart contracts are deployed and ready for interaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {!isClient ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <span className="ml-3 font-mono text-white font-bold tracking-wider">LOADING...</span>
          </div>
        ) : (
          <>
        {/* Network Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-3">
                <Zap className="w-6 h-6" />
                NETWORK STATUS
              </h3>
          {!isConnected ? (
                <Alert className="bg-yellow-600 border-4 border-yellow-600 text-white shadow-[6px_6px_0px_0px_#666]">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-mono font-bold tracking-wider">
                Please connect your wallet to check contract status
              </AlertDescription>
            </Alert>
          ) : networkStatus === 'wrong' ? (
                <Alert className="bg-red-600 border-4 border-red-600 text-white shadow-[6px_6px_0px_0px_#666]">
                  <XCircle className="h-5 w-5" />
                  <AlertDescription className="font-mono font-bold tracking-wider">
                Wrong network! Please switch to BNB Testnet (Chain ID: 97). Currently on: {getNetworkName()}
              </AlertDescription>
            </Alert>
          ) : (
                <Alert className="bg-green-600 border-4 border-green-600 text-white shadow-[6px_6px_0px_0px_#666]">
                  <CheckCircle className="h-5 w-5" />
                  <AlertDescription className="font-mono font-bold tracking-wider">
                Connected to {getNetworkName()} ✓
              </AlertDescription>
            </Alert>
          )}
            </motion.div>

        {/* Contract Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1 flex items-center gap-3">
                <Shield className="w-6 h-6" />
                SMART CONTRACTS
              </h3>
              <div className="space-y-4">
                {contracts.map((contract, index) => (
                  <motion.div
                key={contract.name}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                                         <div className="bg-black text-white p-6 border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[10px_10px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                  <StatusIcon contract={contract} />
                  <div>
                                                         <div className="font-mono font-black text-lg tracking-wider text-white">{contract.name}</div>
                             <div className="font-mono text-sm text-[#d1d5db] tracking-wide">
                              {contract.address && contract.address.length > 20 ? `${contract.address.slice(0, 6)}...${contract.address.slice(-4)}` : contract.address || "Not set"}
                    </div>
                    {contract.error && (
                              <div className="font-mono text-xs text-red-600 font-bold">{contract.error}</div>
                    )}
                  </div>
                </div>
                
                        <div className="flex items-center gap-3">
                  <StatusBadge contract={contract} />
                  {contract.isDeployed && getExplorerUrl(contract.address) && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(contract.address)!, '_blank')}
                                className="bg-black border-2 border-black text-white hover:bg-gray-800 font-mono font-bold text-xs tracking-wider shadow-[3px_3px_0px_0px_#666] hover:shadow-[4px_4px_0px_0px_#666] transition-all duration-200"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      VIEW
                    </Button>
                            </motion.div>
                  )}
                </div>
              </div>
                    </div>
                  </motion.div>
            ))}
          </div>
            </motion.div>

        {/* Deployment Instructions */}
        {contracts.some(c => !c.isDeployed) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-black font-mono text-white tracking-[0.1em] transform -skew-x-1">
                  DEPLOYMENT REQUIRED
                </h3>
                <Alert className="bg-yellow-600 border-4 border-yellow-600 text-white shadow-[6px_6px_0px_0px_#666]">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-mono font-bold space-y-3">
                <div>Some contracts are not deployed. Follow these steps:</div>
                                         <div className="bg-black text-white p-4 border-2 border-black font-mono text-sm shadow-[4px_4px_0px_0px_#666]">
                  <div>1. cd hardhat</div>
                  <div>2. npm install</div>
                  <div>3. npm run compile</div>
                  <div>4. npm run deploy</div>
                </div>
                <div>After deployment, refresh this page to see updated status.</div>
              </AlertDescription>
            </Alert>
              </motion.div>
        )}

        {/* Success Status */}
        {isConnected && networkStatus === 'correct' && contracts.every(c => c.isDeployed) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Alert className="bg-green-600 border-4 border-green-600 text-white shadow-[6px_6px_0px_0px_#666]">
                  <CheckCircle className="h-5 w-5" />
                  <AlertDescription className="font-mono font-bold tracking-wider">
              🎉 All contracts are deployed and ready! You can now mint CARV IDs and Reputation NFTs.
            </AlertDescription>
          </Alert>
              </motion.div>
        )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
        <Button
          onClick={checkContractDeployments}
          disabled={!isConnected || networkStatus !== 'correct'}
                                 className="w-full bg-black text-white hover:bg-[#1a1a1a] font-mono font-black tracking-[0.1em] py-4 border-4 border-white shadow-[8px_8px_0px_0px_#666] hover:shadow-[10px_10px_0px_0px_#666] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 transform -skew-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
                <Loader2 className={`w-5 h-5 mr-3 ${contracts.some(c => c.isLoading) ? 'animate-spin' : ''}`} />
          REFRESH STATUS
        </Button>
            </motion.div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
