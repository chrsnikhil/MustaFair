import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// Type definitions
interface Web2Binding {
  provider: 'github' | 'google';
  username?: string;
  email?: string;
  verified: boolean;
  linkedAt: string;
}

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, max-age=300', // 5 minutes cache
};

// Load contract information
const getContractInfo = () => {
  try {
    const deploymentsPath = path.join(process.cwd(), 'hardhat', 'deployments.json');
    if (fs.existsSync(deploymentsPath)) {
      const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
      
      const carvIdABIPath = path.join(process.cwd(), 'lib', 'ModularCarvID_ABI.json');
      
      if (fs.existsSync(carvIdABIPath)) {
        const carvIdABI = JSON.parse(fs.readFileSync(carvIdABIPath, 'utf8'));
        
        return {
          address: deployments.contracts.ModularCarvID?.address || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          abi: carvIdABI
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading contract info:', error);
    return null;
  }
};

// Initialize provider
const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'
);

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid Ethereum address format',
          code: 'INVALID_ADDRESS'
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const contractInfo = getContractInfo();
    if (!contractInfo) {
      return NextResponse.json(
        { 
          success: false,
          error: 'CARV ID contract not deployed',
          message: 'The ModularCarvID contract is not yet deployed',
          code: 'CONTRACT_NOT_DEPLOYED',
          mockData: {
            wallet: address,
            hasIdentity: false,
            tokenId: null,
            metadata: null,
            web2Bindings: [] as Web2Binding[],
            network: 'BNB Testnet',
            chainId: 97
          }
        },
        { status: 503, headers: corsHeaders }
      );
    }

    const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider);

    try {
      // Check if wallet has a CARV ID
      const tokenId = await contract.walletToTokenId(address);
      
      if (!tokenId || Number(tokenId) === 0) {
        return NextResponse.json({
          success: true,
          data: {
            wallet: address,
            hasIdentity: false,
            tokenId: null,
            metadata: null,
            web2Bindings: [] as Web2Binding[],
            contractAddress: contractInfo.address,
            network: 'BNB Testnet',
            chainId: 97,
            message: 'No CARV ID found for this wallet'
          }
        }, { headers: corsHeaders });
      }

      // Get token metadata
      const tokenURI = await contract.tokenURI(tokenId);
      let metadata = null;
      
      if (tokenURI.startsWith('data:application/json;base64,')) {
        const base64Data = tokenURI.replace('data:application/json;base64,', '');
        metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString('utf8'));
      }

      // Fetch Web2 bindings and achievements
      let web2Achievements = null;
      let web2Bindings: Web2Binding[] = [];
      
      try {
        // Mock Web2 bindings - in a real implementation, this would come from the smart contract
        web2Bindings = [
          {
            provider: 'github',
            username: 'demo-user',
            verified: true,
            linkedAt: new Date().toISOString()
          },
          {
            provider: 'google',
            email: 'demo@example.com',
            verified: true,
            linkedAt: new Date().toISOString()
          }
        ] as Web2Binding[];

        // Fetch actual Web2 achievements
        const achievementsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/web2/achievements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            identities: web2Bindings.map(binding => ({
              provider: binding.provider,
              username: binding.username,
              email: binding.email
            }))
          })
        });

        if (achievementsResponse.ok) {
          web2Achievements = await achievementsResponse.json();
        }
      } catch (error) {
        console.warn('Failed to fetch Web2 data:', error);
      }

      const response = {
        success: true,
        data: {
          wallet: address,
          hasIdentity: true,
          tokenId: tokenId.toString(),
          metadata,
          web2Bindings,
          web2Achievements,
          contractAddress: contractInfo.address,
          network: 'BNB Testnet',
          chainId: 97,
          timestamp: new Date().toISOString()
        }
      };

      return NextResponse.json(response, { headers: corsHeaders });

    } catch (contractError: any) {
      if (contractError.reason && contractError.reason.includes('No token found')) {
        return NextResponse.json({
          success: true,
          data: {
            wallet: address,
            hasIdentity: false,
            tokenId: null,
            metadata: null,
            web2Bindings: [] as Web2Binding[],
            contractAddress: contractInfo.address,
            network: 'BNB Testnet',
            chainId: 97,
            message: 'No CARV ID found for this wallet'
          }
        }, { headers: corsHeaders });
      }
      
      throw contractError;
    }

  } catch (error: any) {
    console.error('Error in public CARV ID API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch CARV ID data',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
