"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock, InlineCode } from "@/components/syntax-highlighter";
import Link from "next/link";
import { 
  Server, 
  Database, 
  Globe, 
  Shield,
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";

export default function APIDocsPage() {
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
            API DOCUMENTATION
          </h1>
          <p className="text-lg text-gray-300 font-mono">
            REST API reference for MustaFair reputation and identity services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900 border border-gray-700">
            <TabsTrigger value="overview" className="font-mono">Overview</TabsTrigger>
            <TabsTrigger value="authentication" className="font-mono">Auth</TabsTrigger>
            <TabsTrigger value="endpoints" className="font-mono">Endpoints</TabsTrigger>
            <TabsTrigger value="examples" className="font-mono">Examples</TabsTrigger>
            <TabsTrigger value="errors" className="font-mono">Errors</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" id="overview" className="space-y-6">
            <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
              <CardHeader>
                <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  API OVERVIEW
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Base Information */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Base URL</h3>
                  <CodeBlock language="text" showCopyButton={true}>
                    https://musta-fair.vercel.app/api
                  </CodeBlock>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <h4 className="font-bold font-mono text-white">RESTful Design</h4>
                          <p className="text-gray-300 font-mono text-sm">Standard HTTP methods with JSON responses</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <h4 className="font-bold font-mono text-white">Public Access</h4>
                          <p className="text-gray-300 font-mono text-sm">Most endpoints available without authentication</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <h4 className="font-bold font-mono text-white">Real-time Data</h4>
                          <p className="text-gray-300 font-mono text-sm">Live reputation scores and CARV ID data</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <h4 className="font-bold font-mono text-white">Cross-Chain Support</h4>
                          <p className="text-gray-300 font-mono text-sm">BSC Testnet and CARV SVM Chain integration</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <h4 className="font-bold font-mono text-white">Rate Limiting</h4>
                          <p className="text-gray-300 font-mono text-sm">Fair usage policies to ensure availability</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <h4 className="font-bold font-mono text-white">Batch Operations</h4>
                          <p className="text-gray-300 font-mono text-sm">Efficient multi-address queries</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Format */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Response Format</h3>
                  <p className="text-gray-300 font-mono mb-4">
                    All API responses follow a consistent JSON structure:
                  </p>
                  <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    // Response payload
  },
  "error": null,
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0"
}`}
                  </CodeBlock>
                </div>

                {/* Rate Limits */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">Rate Limits</h3>
                  <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-bold font-mono text-white mb-2">Standard</h4>
                        <p className="text-blue-200 font-mono text-sm">100 requests/minute</p>
                      </div>
                      <div>
                        <h4 className="font-bold font-mono text-white mb-2">Batch</h4>
                        <p className="text-blue-200 font-mono text-sm">20 requests/minute</p>
                      </div>
                      <div>
                        <h4 className="font-bold font-mono text-white mb-2">Heavy</h4>
                        <p className="text-blue-200 font-mono text-sm">10 requests/minute</p>
                      </div>
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
                  AUTHENTICATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Public vs Protected */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Endpoint Types</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-900/20 border border-green-600 p-4 rounded">
                      <h4 className="font-bold font-mono text-white mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Public Endpoints
                      </h4>
                      <p className="text-green-200 font-mono text-sm mb-3">
                        No authentication required. Access user profiles, leaderboards, and statistics.
                      </p>
                      <ul className="text-green-200 font-mono text-xs space-y-1">
                        <li>• GET /public/profile/:address</li>
                        <li>• GET /public/reputation/:address</li>
                        <li>• GET /public/leaderboard</li>
                        <li>• GET /public/stats</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded">
                      <h4 className="font-bold font-mono text-white mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Protected Endpoints
                      </h4>
                      <p className="text-yellow-200 font-mono text-sm mb-3">
                        Require CARV ID authentication. Access private data and perform actions.
                      </p>
                      <ul className="text-yellow-200 font-mono text-xs space-y-1">
                        <li>• POST /auth/carv-id</li>
                        <li>• GET /auth/profile</li>
                        <li>• POST /voting/submit</li>
                        <li>• POST /reputation-nft/mint</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CARV ID Authentication */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-3">CARV ID Authentication</h3>
                  <p className="text-gray-300 font-mono mb-4">
                    Protected endpoints use wallet signature verification. No API keys required.
                  </p>
                  
                  <h4 className="text-lg font-bold font-mono text-white mb-3">Authentication Flow</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h5 className="font-bold font-mono text-white">Connect Wallet</h5>
                        <p className="text-gray-300 font-mono text-sm">User connects Web3 wallet with CARV ID NFT</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h5 className="font-bold font-mono text-white">Request Challenge</h5>
                        <p className="text-gray-300 font-mono text-sm">POST /auth/carv-id with wallet address</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h5 className="font-bold font-mono text-white">Sign Message</h5>
                        <p className="text-gray-300 font-mono text-sm">User signs challenge message with wallet</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h5 className="font-bold font-mono text-white">Verify & Authenticate</h5>
                        <p className="text-gray-300 font-mono text-sm">Server verifies signature and returns session token</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Authentication Example */}
                <div>
                  <h4 className="text-lg font-bold font-mono text-white mb-3">Example Request</h4>
                  <CodeBlock language="json">
{`{
  "address": "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
  "signature": "0x...",
  "message": "Authenticate with CARV ID: 1642524600",
  "chainId": 97
}`}
                  </CodeBlock>
                </div>

                {/* Session Management */}
                <div>
                  <h4 className="text-lg font-bold font-mono text-white mb-3">Session Management</h4>
                  <p className="text-gray-300 font-mono mb-3">
                    Include the session token in subsequent requests:
                  </p>
                  <CodeBlock language="text">
{`Authorization: Bearer <session-token>
Content-Type: application/json`}
                  </CodeBlock>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" id="endpoints" className="space-y-6">
            <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
              <CardHeader>
                <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                  <Server className="w-6 h-6" />
                  API ENDPOINTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Public Endpoints */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Public Endpoints</h3>
                  
                  <div className="space-y-4">
                    {/* Get Profile */}
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-green-600 text-white font-mono">GET</Badge>
                        <InlineCode>/api/public/profile/:address</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Get complete user profile including CARV ID and reputation data.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Parameters:</h5>
                        <ul className="text-gray-300 font-mono text-xs space-y-1">
                          <li><InlineCode>address</InlineCode> (string) - Ethereum wallet address</li>
                        </ul>
                        <h5 className="font-bold font-mono text-white text-sm">Response:</h5>
                        <CodeBlock language="json" showCopyButton={false}>
{`{
  "success": true,
  "data": {
    "address": "0x...",
    "carvId": {
      "tokenId": "123",
      "identityHash": "0x...",
      "githubHandle": "user123",
      "isVerified": true
    },
    "reputation": {
      "tier": "Gold",
      "contributionScore": 2500,
      "isActive": true,
      "nftAddress": "0x..."
    },
    "web2Achievements": [...]
  }
}`}
                        </CodeBlock>
                      </div>
                    </div>

                    {/* Get Reputation */}
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-green-600 text-white font-mono">GET</Badge>
                        <InlineCode>/api/public/reputation/:address</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Get reputation NFT data only.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Parameters:</h5>
                        <ul className="text-gray-300 font-mono text-xs space-y-1">
                          <li><InlineCode>address</InlineCode> (string) - Ethereum wallet address</li>
                        </ul>
                      </div>
                    </div>

                    {/* Get Leaderboard */}
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-green-600 text-white font-mono">GET</Badge>
                        <InlineCode>/api/public/leaderboard</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Get paginated leaderboard with filtering options.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Query Parameters:</h5>
                        <ul className="text-gray-300 font-mono text-xs space-y-1">
                          <li><InlineCode>page</InlineCode> (number) - Page number (default: 1)</li>
                          <li><InlineCode>limit</InlineCode> (number) - Items per page (default: 20, max: 100)</li>
                          <li><InlineCode>tier</InlineCode> (string) - Filter by tier (Bronze, Silver, Gold)</li>
                          <li><InlineCode>sortBy</InlineCode> (string) - Sort field (score, tier, createdAt)</li>
                          <li><InlineCode>sortOrder</InlineCode> (string) - Sort direction (asc, desc)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Get Stats */}
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-green-600 text-white font-mono">GET</Badge>
                        <InlineCode>/api/public/stats</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Get platform-wide statistics and metrics.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Response:</h5>
                        <CodeBlock language="json" showCopyButton={false}>
{`{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalCarvIds": 890,
    "totalRepNFTs": 650,
    "tierDistribution": {
      "Bronze": 450,
      "Silver": 150,
      "Gold": 50
    },
    "averageScore": 1250.5,
    "activeUsers": 780
  }
}`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Protected Endpoints */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Protected Endpoints</h3>
                  
                  <div className="space-y-4">
                    {/* Auth */}
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-blue-600 text-white font-mono">POST</Badge>
                        <InlineCode>/api/auth/carv-id</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Authenticate with CARV ID using wallet signature.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Request Body:</h5>
                        <CodeBlock language="json" showCopyButton={false}>
{`{
  "address": "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
  "signature": "0x...",
  "message": "Authenticate with CARV ID: 1642524600",
  "chainId": 97
}`}
                        </CodeBlock>
                      </div>
                    </div>

                    {/* Mint Rep NFT */}
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-blue-600 text-white font-mono">POST</Badge>
                        <InlineCode>/api/reputation-nft/mint</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Mint a reputation NFT for authenticated user.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Headers:</h5>
                        <InlineCode>Authorization: Bearer &lt;token&gt;</InlineCode>
                      </div>
                    </div>

                    {/* Submit Vote */}
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-blue-600 text-white font-mono">POST</Badge>
                        <InlineCode>/api/voting/submit</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Submit a vote for tier upgrades or governance proposals.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Request Body:</h5>
                        <CodeBlock language="json" showCopyButton={false}>
{`{
  "proposalId": "prop_123",
  "vote": "approve",
  "comment": "Strong contributor, deserves upgrade"
}`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Batch Endpoints */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Batch Endpoints</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-purple-600 text-white font-mono">POST</Badge>
                        <InlineCode>/api/public/batch/profiles</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        Get profiles for multiple addresses in a single request.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-bold font-mono text-white text-sm">Request Body:</h5>
                        <CodeBlock language="json" showCopyButton={false}>
{`{
  "addresses": [
    "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
    "0x892C6A4A5e29Ad0C20a78B5b6dE55fB2E8B1e8D4"
  ],
  "includeReputation": true,
  "includeCarvId": true
}`}
                        </CodeBlock>
                        <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded">
                          <p className="text-yellow-200 font-mono text-xs">
                            <strong>Rate Limit:</strong> Maximum 50 addresses per request, 20 requests/minute
                          </p>
                        </div>
                      </div>
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
                  <Zap className="w-6 h-6" />
                  API EXAMPLES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* JavaScript Examples */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">JavaScript (fetch)</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold font-mono text-white mb-3">Get User Profile</h4>
                      <CodeBlock language="javascript">
{`async function getUserProfile(address) {
  try {
    const response = await fetch(
      \`https://musta-fair.vercel.app/api/public/profile/\${address}\`
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('User profile:', data.data);
      return data.data;
    } else {
      console.error('API error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
}

// Usage
const profile = await getUserProfile('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3');`}
                      </CodeBlock>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold font-mono text-white mb-3">Get Leaderboard with Filters</h4>
                      <CodeBlock language="javascript">
{`async function getLeaderboard(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    sortBy: filters.sortBy || 'score',
    sortOrder: filters.sortOrder || 'desc',
    ...(filters.tier && { tier: filters.tier })
  });
  
  try {
    const response = await fetch(
      \`https://musta-fair.vercel.app/api/public/leaderboard?\${params}\`
    );
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return null;
  }
}

// Usage
const goldLeaderboard = await getLeaderboard({
  tier: 'Gold',
  page: 1,
  limit: 10
});`}
                      </CodeBlock>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold font-mono text-white mb-3">Batch Profile Fetch</h4>
                      <CodeBlock language="javascript">
{`async function getBatchProfiles(addresses) {
  try {
    const response = await fetch(
      'https://musta-fair.vercel.app/api/public/batch/profiles',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addresses,
          includeReputation: true,
          includeCarvId: true
        })
      }
    );
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch batch profiles:', error);
    return null;
  }
}

// Usage
const addresses = [
  '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
  '0x892C6A4A5e29Ad0C20a78B5b6dE55fB2E8B1e8D4'
];
const profiles = await getBatchProfiles(addresses);`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>

                {/* Python Examples */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Python (requests)</h3>
                  
                  <CodeBlock language="python">
{`import requests
import json

class MustaFairAPI:
    def __init__(self, base_url="https://musta-fair.vercel.app/api"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_profile(self, address):
        """Get user profile by wallet address."""
        try:
            response = self.session.get(f"{self.base_url}/public/profile/{address}")
            response.raise_for_status()
            
            data = response.json()
            return data['data'] if data['success'] else None
        except requests.exceptions.RequestException as e:
            print(f"Error fetching profile: {e}")
            return None
    
    def get_leaderboard(self, **filters):
        """Get leaderboard with optional filters."""
        params = {
            'page': filters.get('page', 1),
            'limit': filters.get('limit', 20),
            'sortBy': filters.get('sort_by', 'score'),
            'sortOrder': filters.get('sort_order', 'desc')
        }
        
        if 'tier' in filters:
            params['tier'] = filters['tier']
        
        try:
            response = self.session.get(
                f"{self.base_url}/public/leaderboard",
                params=params
            )
            response.raise_for_status()
            
            data = response.json()
            return data['data'] if data['success'] else None
        except requests.exceptions.RequestException as e:
            print(f"Error fetching leaderboard: {e}")
            return None
    
    def get_stats(self):
        """Get platform statistics."""
        try:
            response = self.session.get(f"{self.base_url}/public/stats")
            response.raise_for_status()
            
            data = response.json()
            return data['data'] if data['success'] else None
        except requests.exceptions.RequestException as e:
            print(f"Error fetching stats: {e}")
            return None

# Usage
api = MustaFairAPI()

# Get profile
profile = api.get_profile('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3')
print(f"Profile: {json.dumps(profile, indent=2)}")

# Get gold tier leaderboard
leaderboard = api.get_leaderboard(tier='Gold', limit=5)
print(f"Top 5 Gold users: {json.dumps(leaderboard, indent=2)}")

# Get stats
stats = api.get_stats()
print(f"Platform stats: {json.dumps(stats, indent=2)}")`}
                  </CodeBlock>
                </div>

                {/* cURL Examples */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">cURL Examples</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold font-mono text-white mb-3">Get Profile</h4>
                      <CodeBlock language="bash">
{`curl -X GET "https://musta-fair.vercel.app/api/public/profile/0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3" \\
     -H "Content-Type: application/json"`}
                      </CodeBlock>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold font-mono text-white mb-3">Get Filtered Leaderboard</h4>
                      <CodeBlock language="bash">
{`curl -X GET "https://musta-fair.vercel.app/api/public/leaderboard?tier=Gold&page=1&limit=10&sortBy=score&sortOrder=desc" \\
     -H "Content-Type: application/json"`}
                      </CodeBlock>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold font-mono text-white mb-3">Batch Profile Request</h4>
                      <CodeBlock language="bash">
{`curl -X POST "https://musta-fair.vercel.app/api/public/batch/profiles" \\
     -H "Content-Type: application/json" \\
     -d '{
       "addresses": [
         "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
         "0x892C6A4A5e29Ad0C20a78B5b6dE55fB2E8B1e8D4"
       ],
       "includeReputation": true,
       "includeCarvId": true
     }'`}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" id="rate-limits" className="space-y-6">
            <Card className="bg-black border-2 border-white shadow-[8px_8px_0px_0px_#666]">
              <CardHeader>
                <CardTitle className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  ERROR HANDLING
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* HTTP Status Codes */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">HTTP Status Codes</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-green-900/20 border border-green-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-green-600 text-white font-mono">200</Badge>
                          <span className="font-mono text-white font-bold">OK</span>
                        </div>
                        <p className="text-green-200 font-mono text-sm">Request successful</p>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-red-600 text-white font-mono">400</Badge>
                          <span className="font-mono text-white font-bold">Bad Request</span>
                        </div>
                        <p className="text-red-200 font-mono text-sm">Invalid parameters or request body</p>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-red-600 text-white font-mono">401</Badge>
                          <span className="font-mono text-white font-bold">Unauthorized</span>
                        </div>
                        <p className="text-red-200 font-mono text-sm">Authentication required or invalid</p>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-red-600 text-white font-mono">403</Badge>
                          <span className="font-mono text-white font-bold">Forbidden</span>
                        </div>
                        <p className="text-red-200 font-mono text-sm">Insufficient permissions</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-red-900/20 border border-red-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-red-600 text-white font-mono">404</Badge>
                          <span className="font-mono text-white font-bold">Not Found</span>
                        </div>
                        <p className="text-red-200 font-mono text-sm">Resource does not exist</p>
                      </div>
                      
                      <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-yellow-600 text-white font-mono">429</Badge>
                          <span className="font-mono text-white font-bold">Too Many Requests</span>
                        </div>
                        <p className="text-yellow-200 font-mono text-sm">Rate limit exceeded</p>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-red-600 text-white font-mono">500</Badge>
                          <span className="font-mono text-white font-bold">Internal Server Error</span>
                        </div>
                        <p className="text-red-200 font-mono text-sm">Server error occurred</p>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-600 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-red-600 text-white font-mono">503</Badge>
                          <span className="font-mono text-white font-bold">Service Unavailable</span>
                        </div>
                        <p className="text-red-200 font-mono text-sm">Service temporarily unavailable</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Response Format */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Error Response Format</h3>
                  
                  <CodeBlock language="json">
{`{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "The provided wallet address is invalid",
    "details": {
      "field": "address",
      "value": "invalid-address",
      "expected": "Valid Ethereum address (0x...)"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0"
}`}
                  </CodeBlock>
                </div>

                {/* Common Error Codes */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Common Error Codes</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <InlineCode>INVALID_ADDRESS</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Provided wallet address is malformed or invalid</p>
                    </div>
                    
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <InlineCode>USER_NOT_FOUND</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">No data found for the specified address</p>
                    </div>
                    
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <InlineCode>NO_CARV_ID</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">User does not have a CARV ID NFT</p>
                    </div>
                    
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <InlineCode>NO_REPUTATION</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">User does not have a reputation NFT</p>
                    </div>
                    
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <InlineCode>INVALID_SIGNATURE</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Wallet signature verification failed</p>
                    </div>
                    
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <InlineCode>RATE_LIMIT_EXCEEDED</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Too many requests, please slow down</p>
                    </div>
                    
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <InlineCode>BATCH_TOO_LARGE</InlineCode>
                      </div>
                      <p className="text-gray-300 font-mono text-sm">Batch request contains too many items (max: 50)</p>
                    </div>
                  </div>
                </div>

                {/* Error Handling Best Practices */}
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-4">Error Handling Best Practices</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                      <h4 className="font-bold font-mono text-white mb-2">1. Check Response Status</h4>
                      <p className="text-blue-200 font-mono text-sm mb-3">
                        Always check the <InlineCode>success</InlineCode> field before accessing <InlineCode>data</InlineCode>.
                      </p>
                      <CodeBlock language="javascript" showCopyButton={false}>
{`if (response.success) {
  // Handle successful response
  console.log(response.data);
} else {
  // Handle error
  console.error(response.error.message);
}`}
                      </CodeBlock>
                    </div>
                    
                    <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded">
                      <h4 className="font-bold font-mono text-white mb-2">2. Implement Retry Logic</h4>
                      <p className="text-yellow-200 font-mono text-sm mb-3">
                        For rate limits (429) and server errors (5xx), implement exponential backoff.
                      </p>
                      <CodeBlock language="javascript" showCopyButton={false}>
{`async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.status !== 429 && response.status < 500) {
        return response;
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
  }
}`}
                      </CodeBlock>
                    </div>
                    
                    <div className="bg-green-900/20 border border-green-600 p-4 rounded">
                      <h4 className="font-bold font-mono text-white mb-2">3. Validate Input</h4>
                      <p className="text-green-200 font-mono text-sm">
                        Validate wallet addresses and other inputs client-side before making API calls.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
