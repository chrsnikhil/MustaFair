import { NextRequest, NextResponse } from 'next/server';

// CORS headers for public API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, max-age=3600', // 1 hour cache for docs
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const apiDocumentation = {
    name: "MustaFair Public API",
    description: "Decentralized Reputation and Content Curation Platform - Public API for querying rep-NFTs and CARV ID profiles",
    version: "1.0.0",
    baseUrl,
    documentation: {
      github: "https://github.com/chrsnikhil/MustaFair",
      website: "https://mustafair.vercel.app"
    },
    endpoints: {
      reputation: {
        description: "Get complete reputation and identity data for a wallet address",
        endpoint: "/api/public/reputation/{address}",
        method: "GET",
        parameters: {
          address: {
            type: "string",
            description: "Ethereum wallet address (0x...)",
            required: true,
            example: "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3"
          }
        },
        responses: {
          200: {
            description: "Success",
            example: {
              success: true,
              data: {
                wallet: "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
                reputation: {
                  tokenId: "1",
                  contributionScore: 2500,
                  tier: "Gold",
                  tierLevel: 2,
                  creationDate: "2025-07-11T10:30:00.000Z",
                  carvIdLinked: true,
                  carvIdHash: "0x123...",
                  isActive: true,
                  metadata: {},
                  contractAddress: "0x..."
                },
                carvId: {
                  tokenId: "42",
                  metadata: {},
                  contractAddress: "0x...",
                  isValid: true
                },
                web2Achievements: {
                  totalScore: 1820,
                  overallTier: "Silver",
                  providers: []
                },
                network: "BNB Testnet",
                chainId: 97,
                contracts: {},
                timestamp: "2025-07-11T12:00:00.000Z"
              }
            }
          },
          400: { description: "Invalid address format" },
          503: { description: "Contracts not deployed" }
        }
      },
      carvId: {
        description: "Get CARV ID profile and Web2 bindings for a wallet address",
        endpoint: "/api/public/carv-id/{address}",
        method: "GET",
        parameters: {
          address: {
            type: "string",
            description: "Ethereum wallet address (0x...)",
            required: true,
            example: "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3"
          }
        },
        responses: {
          200: {
            description: "Success",
            example: {
              success: true,
              data: {
                wallet: "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
                hasIdentity: true,
                tokenId: "42",
                metadata: {
                  name: "CARV ID #42",
                  description: "Modular identity NFT",
                  attributes: []
                },
                web2Bindings: [
                  {
                    provider: "github",
                    username: "demo-user",
                    verified: true,
                    linkedAt: "2025-07-11T10:00:00.000Z"
                  }
                ],
                web2Achievements: {},
                contractAddress: "0x...",
                network: "BNB Testnet",
                chainId: 97,
                timestamp: "2025-07-11T12:00:00.000Z"
              }
            }
          }
        }
      },
      leaderboard: {
        description: "Get paginated reputation leaderboard with filtering and sorting",
        endpoint: "/api/public/leaderboard",
        method: "GET",
        parameters: {
          page: {
            type: "number",
            description: "Page number (default: 1)",
            required: false,
            example: 1
          },
          limit: {
            type: "number",
            description: "Items per page (default: 20, max: 100)",
            required: false,
            example: 20
          },
          tier: {
            type: "string",
            description: "Filter by tier (Bronze, Silver, Gold, Platinum)",
            required: false,
            example: "Gold"
          },
          sortBy: {
            type: "string",
            description: "Sort field (score, creationDate, tier) - default: creationDate",
            required: false,
            example: "score"
          },
          sortOrder: {
            type: "string",
            description: "Sort order (asc, desc) - default: desc",
            required: false,
            example: "desc"
          }
        },
        responses: {
          200: {
            description: "Success",
            example: {
              success: true,
              data: {
                totalCount: 87,
                page: 1,
                limit: 20,
                totalPages: 5,
                reputations: [
                  {
                    tokenId: "1",
                    wallet: "0x...",
                    contributionScore: 4500,
                    tier: "Platinum",
                    tierLevel: 3,
                    creationDate: "2025-07-11T10:30:00.000Z",
                    carvIdLinked: true,
                    carvIdHash: "0x...",
                    isActive: true,
                    metadata: {}
                  }
                ],
                filters: {
                  tier: null,
                  sortBy: "score",
                  sortOrder: "desc"
                },
                contractAddress: "0x...",
                network: "BNB Testnet",
                chainId: 97,
                timestamp: "2025-07-11T12:00:00.000Z"
              }
            }
          }
        }
      },
      stats: {
        description: "Get platform-wide statistics and metrics",
        endpoint: "/api/public/stats",
        method: "GET",
        responses: {
          200: {
            description: "Success",
            example: {
              success: true,
              data: {
                platform: {
                  totalUsers: 150,
                  totalReputationNFTs: 87,
                  totalCarvIds: 142,
                  activeUsers: 89
                },
                reputation: {
                  totalScore: 125750,
                  averageScore: 1446.55,
                  tierDistribution: {
                    Bronze: 45,
                    Silver: 28,
                    Gold: 12,
                    Platinum: 2
                  },
                  topScore: 4500
                },
                web2Integration: {
                  githubConnections: 78,
                  googleConnections: 64,
                  multiPlatformUsers: 42,
                  averageWeb2Score: 1820.33
                },
                network: {
                  name: "BNB Testnet",
                  chainId: 97,
                  blockNumber: "12345678"
                },
                contracts: {
                  reputationNFT: "0x...",
                  carvId: "0x..."
                },
                lastUpdated: "2025-07-11T12:00:00.000Z"
              }
            }
          }
        }
      }
    },
    schemas: {
      ReputationData: {
        type: "object",
        properties: {
          tokenId: { type: "string", description: "NFT token ID" },
          contributionScore: { type: "number", description: "Accumulated contribution score" },
          tier: { type: "string", enum: ["Bronze", "Silver", "Gold", "Platinum"] },
          tierLevel: { type: "number", description: "Numeric tier level (0-3)" },
          creationDate: { type: "string", format: "date-time" },
          carvIdLinked: { type: "boolean", description: "Whether linked to CARV ID" },
          carvIdHash: { type: "string", description: "Hash of linked CARV ID" },
          isActive: { type: "boolean", description: "Whether reputation is active" },
          metadata: { type: "object", description: "NFT metadata" },
          contractAddress: { type: "string", description: "Smart contract address" }
        }
      },
      CarvIdData: {
        type: "object",
        properties: {
          tokenId: { type: "string", description: "CARV ID token ID" },
          metadata: { type: "object", description: "Identity metadata" },
          contractAddress: { type: "string", description: "Smart contract address" },
          isValid: { type: "boolean", description: "Whether identity is valid" }
        }
      },
      Web2Binding: {
        type: "object",
        properties: {
          provider: { type: "string", enum: ["github", "google"] },
          username: { type: "string", description: "Username for the provider" },
          email: { type: "string", description: "Email for the provider" },
          verified: { type: "boolean", description: "Whether binding is verified" },
          linkedAt: { type: "string", format: "date-time" }
        }
      }
    },
    usage: {
      rateLimit: "No rate limiting currently implemented",
      authentication: "No authentication required for public endpoints",
      cors: "CORS enabled for all origins",
      caching: "Responses cached for 5 minutes (stats: 1 minute, docs: 1 hour)"
    },
    examples: {
      curl: {
        reputation: `curl "${baseUrl}/api/public/reputation/0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3"`,
        carvId: `curl "${baseUrl}/api/public/carv-id/0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3"`,
        leaderboard: `curl "${baseUrl}/api/public/leaderboard?page=1&limit=10&tier=Gold&sortBy=score&sortOrder=desc"`,
        stats: `curl "${baseUrl}/api/public/stats"`
      },
      javascript: {
        reputation: `
const response = await fetch('${baseUrl}/api/public/reputation/0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3');
const data = await response.json();
console.log(data.data.reputation);`,
        leaderboard: `
const response = await fetch('${baseUrl}/api/public/leaderboard?tier=Gold&sortBy=score');
const data = await response.json();
console.log('Top reputations:', data.data.reputations);`
      }
    },
    status: {
      health: `${baseUrl}/api/public/stats`,
      lastDeployed: new Date().toISOString(),
      version: "1.0.0"
    }
  };

  return NextResponse.json(apiDocumentation, { headers: corsHeaders });
}
