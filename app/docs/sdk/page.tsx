"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock, InlineCode } from "@/components/syntax-highlighter";
import Link from "next/link";
import { 
  Code, 
  Download, 
  Terminal, 
  Shield, 
  Zap,
  ArrowLeft,
  Copy,
  ExternalLink,
  CheckCircle
} from "lucide-react";

export default function SDKDocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/docs">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Docs
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-black font-mono tracking-[0.1em] text-white mb-2">
            SDK DOCUMENTATION
          </h1>
          <p className="text-lg text-gray-300 font-mono">
            Complete guide for integrating the MustaFair SDK into your applications
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="installation" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700">
            <TabsTrigger value="installation" className="font-mono">Installation</TabsTrigger>
            <TabsTrigger value="authentication" className="font-mono">Authentication</TabsTrigger>
            <TabsTrigger value="api-reference" className="font-mono">API Reference</TabsTrigger>
            <TabsTrigger value="examples" className="font-mono">Examples</TabsTrigger>
          </TabsList>

          {/* Installation Tab */}
          <TabsContent value="installation" id="installation" className="space-y-6">
            <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
              <CardHeader>
                <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                  <Download className="w-6 h-6" />
                  INSTALLATION & SETUP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* NPM Installation */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Install via NPM</h3>
                  <CodeBlock                    language="bash"
                    className="mb-4"
                  >
                    npm install @mustafair/reputation-sdk
                  </CodeBlock>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-300 font-mono text-sm">Alternative package managers:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <CodeBlock language="bash" showCopyButton={false}>
                        yarn add @mustafair/reputation-sdk
                      </CodeBlock>
                      <CodeBlock language="bash" showCopyButton={false}>
                        pnpm add @mustafair/reputation-sdk
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                {/* Peer Dependencies */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Peer Dependencies</h3>
                  <p className="text-gray-300 font-mono mb-3">
                    For Web3 functionality, install these optional peer dependencies:
                  </p>
                  <CodeBlock language="bash">
                    npm install viem wagmi
                  </CodeBlock>
                </div>

                {/* Basic Import */}
                <div id="basic-usage">
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Basic Import</h3>
                  <CodeBlock language="typescript">
{`import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';

// Initialize the SDK
const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app');`}
                  </CodeBlock>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">System Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-bold font-mono text-white">Node.js Projects</h4>
                      <ul className="space-y-1 text-gray-300 font-mono text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Node.js ≥ 16.0.0
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          TypeScript ≥ 4.5.0 (optional)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          ES Modules support
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold font-mono text-white">Browser Projects</h4>
                      <ul className="space-y-1 text-gray-300 font-mono text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Modern browsers (ES2020)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          fetch API support
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Web3 wallet (for auth features)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="authentication" id="authentication" className="space-y-6">
            <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
              <CardHeader>
                <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  CARV ID AUTHENTICATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Overview</h3>
                  <p className="text-gray-300 font-mono mb-4">
                    The SDK provides seamless CARV ID authentication using wallet signatures. 
                    This enables secure, decentralized identity verification without requiring passwords.
                  </p>
                  <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                    <p className="text-blue-200 font-mono text-sm">
                      <strong>Note:</strong> Authentication requires a Web3 wallet connection and the user must have a minted CARV ID NFT.
                    </p>
                  </div>
                </div>

                {/* Basic Setup */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Basic Setup</h3>
                  <CodeBlock language="typescript">
{`import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';

// Initialize with authentication config
const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app', 10000, {
  contractAddress: '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
  chainId: 97, // BSC Testnet
  requiredChains: [97, 31337],
  signMessageTemplate: 'Sign this message to authenticate with CARV ID: {timestamp}'
});`}
                  </CodeBlock>
                </div>

                {/* Wallet Connection */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Wallet Connection</h3>
                  <CodeBlock language="typescript">
{`// Set wallet connection (from wagmi, viem, etc.)
await sdk.initialize({
  address: '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
  isConnected: true,
  chainId: 97
});

// Check if wallet is ready for authentication
const isReady = sdk.isWalletReady();
console.log('Wallet ready:', isReady);`}
                  </CodeBlock>
                </div>

                {/* Authentication Flow */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Authentication Flow</h3>
                  <CodeBlock language="typescript">
{`// Authenticate with CARV ID
const authResult = await sdk.authenticateWithCarvId(
  async (message) => {
    // This function should sign the message with the user's wallet
    return await signMessageAsync({ message });
  },
  {
    fetchMetadata: true,
    fetchWeb2Achievements: true
  }
);

if (authResult.success) {
  console.log('Authentication successful!');
  console.log('User data:', authResult.user);
  // Access user.address, user.tokenId, user.identityHash, etc.
} else {
  console.error('Authentication failed:', authResult.error);
}`}
                  </CodeBlock>
                </div>

                {/* React Example */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">React + Wagmi Example</h3>
                  <CodeBlock language="tsx">
{`import { useAccount, useSignMessage } from 'wagmi';
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';

function AuthComponent() {
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [sdk] = useState(() => new Fair3ReputationSDK());

  const authenticate = async () => {
    if (!isConnected) return;
    
    await sdk.initialize({ address, isConnected, chainId });
    
    const result = await sdk.authenticateWithCarvId(
      (message) => signMessageAsync({ message })
    );
    
    if (result.success) {
      // Handle successful authentication
      setUser(result.user);
    }
  };

  return (
    <button onClick={authenticate}>
      Authenticate with CARV ID
    </button>
  );
}`}
                  </CodeBlock>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api-reference" id="api-reference" className="space-y-6">
            <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
              <CardHeader>
                <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                  <Code className="w-6 h-6" />
                  API REFERENCE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Constructor */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Constructor</h3>
                  <CodeBlock language="typescript" showCopyButton={false} className="mb-4">
                    new Fair3ReputationSDK(baseUrl?, timeout?, authConfig?)
                  </CodeBlock>
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="font-mono font-bold text-white">Parameter</div>
                      <div className="font-mono font-bold text-white">Type</div>
                      <div className="font-mono font-bold text-white">Description</div>
                      
                      <div className="font-mono text-blue-400">baseUrl</div>
                      <div className="font-mono text-gray-300">string?</div>
                      <div className="font-mono text-gray-300">API base URL (default: 'https://musta-fair.vercel.app')</div>
                      
                      <div className="font-mono text-blue-400">timeout</div>
                      <div className="font-mono text-gray-300">number?</div>
                      <div className="font-mono text-gray-300">Request timeout in ms (default: 10000)</div>
                      
                      <div className="font-mono text-blue-400">authConfig</div>
                      <div className="font-mono text-gray-300">CarvIdAuthConfig?</div>
                      <div className="font-mono text-gray-300">CARV ID authentication configuration</div>
                    </div>
                  </div>
                </div>

                {/* Core Methods */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Core Methods</h3>
                  
                  {/* Profile Methods */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold font-mono text-white">Profile & Identity</h4>
                    
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>getProfile(address: string): Promise&lt;FullProfileData&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Get complete user profile including reputation and CARV ID data.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>getCarvIdProfile(address: string): Promise&lt;CarvIdProfile&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Get CARV ID profile and Web2 bindings only.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>getReputation(address: string): Promise&lt;ReputationData | null&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Get reputation NFT data only.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>hasCarvId(address: string): Promise&lt;boolean&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Check if wallet has a CARV ID.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>hasReputation(address: string): Promise&lt;boolean&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Check if wallet has a reputation NFT.</p>
                    </div>
                  </div>

                  {/* Leaderboard Methods */}
                  <div className="space-y-4 mt-8">
                    <h4 className="text-lg font-bold font-mono text-white">Leaderboards & Statistics</h4>
                    
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>getLeaderboard(filters?: LeaderboardFilters): Promise&lt;LeaderboardData&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Get paginated leaderboard with filtering and sorting.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>getStats(): Promise&lt;PlatformStats&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Get platform-wide statistics and metrics.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>getTopPerformers(tier?: string, limit?: number): Promise&lt;LeaderboardEntry[]&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Get top performers by tier.</p>
                    </div>
                  </div>

                  {/* Utility Methods */}
                  <div className="space-y-4 mt-8">
                    <h4 className="text-lg font-bold font-mono text-white">Utility Methods</h4>
                    
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>{`static validateAddresses(addresses: string[]): { valid: string[], invalid: string[] }`}</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Validate multiple Ethereum addresses.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>checkReputationRequirements(address: string, requirements: Requirements): Promise&lt;CheckResult&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Check if user meets specific reputation requirements.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="mb-2">
                        <InlineCode>getBatchProfiles(addresses: string[], options?: BatchOptions): Promise&lt;BatchResult[]&gt;</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Batch fetch profiles for multiple addresses.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" id="examples" className="space-y-6">
            <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
              <CardHeader>
                <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                  <Terminal className="w-6 h-6" />
                  INTEGRATION EXAMPLES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* React Example */}
                <div id="react-integration">
                  <h3 className="text-xl font-bold font-mono text-white mb-4">React + Wagmi Integration</h3>
                  <CodeBlock language="tsx">
{`import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';
import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';

function ReputationProfile() {
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [sdk] = useState(() => new Fair3ReputationSDK());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      sdk.initialize({ address, isConnected, chainId });
      loadProfile();
    }
  }, [isConnected, address, chainId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userProfile = await sdk.getProfile(address);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      const result = await sdk.authenticateWithCarvId(
        (message) => signMessageAsync({ message })
      );
      
      if (result.success) {
        console.log('Authenticated!', result.user);
        // Handle successful authentication
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {profile?.reputation ? (
        <div>
          <h3>Reputation: {profile.reputation.tier}</h3>
          <p>Score: {profile.reputation.contributionScore}</p>
          <p>Active: {profile.reputation.isActive ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p>No reputation found</p>
      )}
      
      {profile?.carvId ? (
        <div>
          <h3>CARV ID: #{profile.carvId.tokenId}</h3>
          <button onClick={authenticate}>
            Authenticate with CARV ID
          </button>
        </div>
      ) : (
        <p>No CARV ID found</p>
      )}
    </div>
  );
}`}
                  </CodeBlock>
                </div>

                {/* Node.js Backend Example */}
                <div id="nodejs-integration">
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Node.js Backend</h3>
                  <CodeBlock language="javascript">
{`import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';
import express from 'express';

const app = express();
const sdk = new Fair3ReputationSDK();

// Get user reputation endpoint
app.get('/api/user/:address/reputation', async (req, res) => {
  try {
    const { address } = req.params;
    const reputation = await sdk.getReputation(address);
    
    if (!reputation) {
      return res.status(404).json({ error: 'No reputation found' });
    }
    
    res.json(reputation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check reputation requirements
app.post('/api/check-requirements', async (req, res) => {
  try {
    const { address, requirements } = req.body;
    
    const check = await sdk.checkReputationRequirements(address, {
      minScore: requirements.minScore || 0,
      minTier: requirements.minTier || 'Bronze',
      requireCarvId: requirements.requireCarvId || false
    });
    
    res.json(check);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { tier, page = 1, limit = 20 } = req.query;
    
    const leaderboard = await sdk.getLeaderboard({
      tier,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy: 'score',
      sortOrder: 'desc'
    });
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
                  </CodeBlock>
                </div>

                {/* Vue.js Example */}
                <div id="vue-integration">
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Vue.js + Viem</h3>
                  <CodeBlock language="javascript">
{`<template>
  <div>
    <div v-if="profile?.reputation">
      <h3>Reputation: {{ profile.reputation.tier }}</h3>
      <p>Score: {{ profile.reputation.contributionScore }}</p>
    </div>
    <button @click="authenticate" v-if="profile?.carvId">
      Authenticate with CARV ID
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';
import { createWalletClient, custom } from 'viem';
import { bscTestnet } from 'viem/chains';

const sdk = ref(new Fair3ReputationSDK());
const profile = ref(null);
const wallet = ref(null);

onMounted(async () => {
  if (window.ethereum) {
    wallet.value = createWalletClient({
      chain: bscTestnet,
      transport: custom(window.ethereum)
    });
    
    const [address] = await wallet.value.getAddresses();
    
    await sdk.value.initialize({
      address,
      isConnected: true,
      chainId: bscTestnet.id
    });
    
    profile.value = await sdk.value.getProfile(address);
  }
});

const authenticate = async () => {
  try {
    const result = await sdk.value.authenticateWithCarvId(
      async (message) => {
        const [address] = await wallet.value.getAddresses();
        return await wallet.value.signMessage({
          account: address,
          message
        });
      }
    );
    
    if (result.success) {
      console.log('Authenticated!', result.user);
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};
</script>`}
                  </CodeBlock>
                </div>

                {/* Utility Examples */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Utility Functions</h3>
                  <CodeBlock language="typescript">
{`import { Fair3ReputationSDK, FAIR3_CONSTANTS } from '@mustafair/reputation-sdk';

const sdk = new Fair3ReputationSDK();

// Validate addresses
const addresses = ['0x123...', '0x456...', 'invalid-address'];
const validation = Fair3ReputationSDK.validateAddresses(addresses);
console.log('Valid:', validation.valid);
console.log('Invalid:', validation.invalid);

// Check reputation requirements
const requirements = {
  minScore: 1000,
  minTier: 'Silver',
  requireCarvId: true
};

const check = await sdk.checkReputationRequirements(address, requirements);
if (check.meets) {
  console.log('User meets requirements!');
} else {
  console.log('Requirements not met:', check.reasons);
}

// Format scores
const score = 1500000;
const formatted = Fair3ReputationSDK.formatScore(score); // "1.5M"

// Get tier values for comparison
const tierValue = Fair3ReputationSDK.getTierValue('Gold'); // 2

// Batch fetch profiles
const addresses = ['0x123...', '0x456...', '0x789...'];
const profiles = await sdk.getBatchProfiles(addresses, {
  maxConcurrent: 3,
  includeErrors: true
});

// Use constants
console.log('Supported chains:', FAIR3_CONSTANTS.SUPPORTED_CHAINS);
console.log('Contract addresses:', FAIR3_CONSTANTS.CONTRACT_ADDRESSES);`}
                  </CodeBlock>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
