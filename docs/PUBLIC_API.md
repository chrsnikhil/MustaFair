# MustaFair Public API Documentation

Welcome to the MustaFair Public API! This comprehensive API allows developers to query reputation NFTs and CARV ID profiles from the MustaFair decentralized reputation platform.

## Overview

MustaFair is a Decentralized Reputation and Content Curation Platform built for the FAIR3 Fairness Hackathon. Our public APIs provide access to:

- **Reputation NFTs**: On-chain reputation scores and tier information
- **CARV ID Profiles**: Modular identity with Web2 platform bindings
- **Leaderboards**: Ranked reputation data with filtering and sorting
- **Platform Statistics**: Real-time metrics and analytics

## Base URL

I'll add this after deployment

## Authentication

No authentication is required for public API endpoints. All endpoints support CORS and can be called from any domain.

## Rate Limiting

Currently, no rate limiting is implemented, but we recommend responsible usage.

## Response Caching

- Most endpoints: 5 minutes
- Statistics: 1 minute
- Documentation: 1 hour

## Endpoints

### 1. Get Complete Profile

Get comprehensive reputation and identity data for a wallet address.

**Endpoint:** `GET /api/public/reputation/{address}`

**Parameters:**

- `address` (required): Ethereum wallet address (0x...)

**Response:**

```json
{
  "success": true,
  "data": {
    "wallet": "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
    "reputation": {
      "tokenId": "1",
      "contributionScore": 2500,
      "tier": "Gold",
      "tierLevel": 2,
      "creationDate": "2025-07-11T10:30:00.000Z",
      "carvIdLinked": true,
      "carvIdHash": "0x123...",
      "isActive": true,
      "metadata": {},
      "contractAddress": "0x..."
    },
    "carvId": {
      "tokenId": "42",
      "metadata": {},
      "contractAddress": "0x...",
      "isValid": true
    },
    "web2Achievements": {
      "totalScore": 1820,
      "overallTier": "Silver",
      "providers": [],
      "combinedBadges": [],
      "metadata": {},
      "achievementHash": "0x..."
    },
    "network": "BNB Testnet",
    "chainId": 97,
    "contracts": {
      "reputationNFT": "0x...",
      "carvId": "0x..."
    },
    "timestamp": "2025-07-11T12:00:00.000Z"
  }
}
```

### 2. Get CARV ID Profile

Get CARV ID profile and Web2 bindings for a wallet address.

**Endpoint:** `GET /api/public/carv-id/{address}`

**Parameters:**
- `address` (required): Ethereum wallet address (0x...)

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": "0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3",
    "hasIdentity": true,
    "tokenId": "42",
    "metadata": {
      "name": "CARV ID #42",
      "description": "Modular identity NFT",
      "attributes": []
    },
    "web2Bindings": [
      {
        "provider": "github",
        "username": "demo-user",
        "verified": true,
        "linkedAt": "2025-07-11T10:00:00.000Z"
      },
      {
        "provider": "google",
        "email": "demo@example.com",
        "verified": true,
        "linkedAt": "2025-07-11T10:00:00.000Z"
      }
    ],
    "web2Achievements": {},
    "contractAddress": "0x...",
    "network": "BNB Testnet",
    "chainId": 97,
    "timestamp": "2025-07-11T12:00:00.000Z"
  }
}
```

### 3. Get Reputation Leaderboard

Get paginated reputation leaderboard with filtering and sorting.

**Endpoint:** `GET /api/public/leaderboard`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `tier` (optional): Filter by tier (Bronze, Silver, Gold, Platinum)
- `sortBy` (optional): Sort field (score, creationDate, tier) - default: creationDate
- `sortOrder` (optional): Sort order (asc, desc) - default: desc

**Example:** `/api/public/leaderboard?page=1&limit=10&tier=Gold&sortBy=score&sortOrder=desc`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCount": 87,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "reputations": [
      {
        "tokenId": "1",
        "wallet": "0x...",
        "contributionScore": 4500,
        "tier": "Platinum",
        "tierLevel": 3,
        "creationDate": "2025-07-11T10:30:00.000Z",
        "carvIdLinked": true,
        "carvIdHash": "0x...",
        "isActive": true,
        "metadata": {}
      }
    ],
    "filters": {
      "tier": "Gold",
      "sortBy": "score",
      "sortOrder": "desc"
    },
    "contractAddress": "0x...",
    "network": "BNB Testnet",
    "chainId": 97,
    "timestamp": "2025-07-11T12:00:00.000Z"
  }
}
```

### 4. Get Platform Statistics

Get platform-wide statistics and metrics.

**Endpoint:** `GET /api/public/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": {
      "totalUsers": 150,
      "totalReputationNFTs": 87,
      "totalCarvIds": 142,
      "activeUsers": 89
    },
    "reputation": {
      "totalScore": 125750,
      "averageScore": 1446.55,
      "tierDistribution": {
        "Bronze": 45,
        "Silver": 28,
        "Gold": 12,
        "Platinum": 2
      },
      "topScore": 4500
    },
    "web2Integration": {
      "githubConnections": 78,
      "googleConnections": 64,
      "multiPlatformUsers": 42,
      "averageWeb2Score": 1820.33
    },
    "network": {
      "name": "BNB Testnet",
      "chainId": 97,
      "blockNumber": "12345678"
    },
    "contracts": {
      "reputationNFT": "0x...",
      "carvId": "0x..."
    },
    "lastUpdated": "2025-07-11T12:00:00.000Z"
  }
}
```

### 5. API Documentation

Get comprehensive API documentation and examples.

**Endpoint:** `GET /api/public/docs`

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "message": "Detailed error description"
}
```

**Common Error Codes:**
- `INVALID_ADDRESS`: Invalid Ethereum address format
- `CONTRACT_NOT_DEPLOYED`: Smart contracts not yet deployed
- `CONTRACTS_NOT_DEPLOYED`: Multiple contracts not deployed
- `INTERNAL_ERROR`: Server-side error
- `INVALID_PARAMS`: Invalid query parameters

## Usage Examples

### cURL

```bash
# Get complete profile
curl "https://mustafair.vercel.app/api/public/reputation/0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3"

# Get CARV ID profile
curl "https://mustafair.vercel.app/api/public/carv-id/0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3"

# Get leaderboard with filters
curl "https://mustafair.vercel.app/api/public/leaderboard?page=1&limit=10&tier=Gold&sortBy=score&sortOrder=desc"

# Get platform statistics
curl "https://mustafair.vercel.app/api/public/stats"
```

### JavaScript/TypeScript

```javascript
// Using fetch API
const getProfile = async (address) => {
  const response = await fetch(`https://mustafair.vercel.app/api/public/reputation/${address}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('Reputation:', data.data.reputation);
    console.log('CARV ID:', data.data.carvId);
  } else {
    console.error('Error:', data.error);
  }
};

// Get leaderboard
const getLeaderboard = async () => {
  const response = await fetch('https://mustafair.vercel.app/api/public/leaderboard?tier=Gold&sortBy=score');
  const data = await response.json();
  
  if (data.success) {
    console.log('Top Gold tier users:', data.data.reputations);
  }
};
```

### Using the Fair3 SDK

```typescript
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';

const sdk = new Fair3ReputationSDK('https://mustafair.vercel.app');

// Get complete profile
const profile = await sdk.getProfile('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3');
console.log('Reputation Score:', profile.reputation?.contributionScore);

// Get leaderboard
const leaderboard = await sdk.getLeaderboard({
  tier: 'Gold',
  sortBy: 'score',
  limit: 10
});

// Check if user has reputation
const hasRep = await sdk.hasReputation('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3');

// Get platform stats
const stats = await sdk.getStats();
console.log('Total users:', stats.platform.totalUsers);
```

### Python

```python
import requests

def get_reputation(address):
    url = f"https://mustafair.vercel.app/api/public/reputation/{address}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            return data['data']
    return None

def get_leaderboard(tier=None, page=1, limit=20):
    url = "https://mustafair.vercel.app/api/public/leaderboard"
    params = {'page': page, 'limit': limit}
    if tier:
        params['tier'] = tier
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            return data['data']['reputations']
    return []

# Usage
profile = get_reputation('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3')
top_gold = get_leaderboard(tier='Gold', limit=10)
```

## Data Schemas

### ReputationData
```typescript
interface ReputationData {
  tokenId: string;              // NFT token ID
  contributionScore: number;    // Accumulated contribution score
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierLevel: number;           // Numeric tier level (0-3)
  creationDate: string;        // ISO 8601 timestamp
  carvIdLinked: boolean;       // Whether linked to CARV ID
  carvIdHash: string;          // Hash of linked CARV ID
  isActive: boolean;           // Whether reputation is active
  metadata: object;            // NFT metadata
  contractAddress: string;     // Smart contract address
}
```

### CarvIdData
```typescript
interface CarvIdData {
  tokenId: string;            // CARV ID token ID
  metadata: object;           // Identity metadata
  contractAddress: string;    // Smart contract address
  isValid: boolean;          // Whether identity is valid
}
```

### Web2Binding
```typescript
interface Web2Binding {
  provider: 'github' | 'google';
  username?: string;          // Username for the provider
  email?: string;            // Email for the provider
  verified: boolean;         // Whether binding is verified
  linkedAt: string;          // ISO 8601 timestamp
}
```

## SDK Installation

```bash
# Install the Fair3 Reputation SDK
npm install @mustafair/reputation-sdk

# Or use from CDN
<script src="https://unpkg.com/@mustafair/reputation-sdk/dist/index.js"></script>
```

## Support

- **GitHub**: [https://github.com/chrsnikhil/MustaFair](https://github.com/chrsnikhil/MustaFair)
- **Documentation**: [https://mustafair.vercel.app/docs](https://mustafair.vercel.app/docs)
- **Demo**: [https://mustafair.vercel.app](https://mustafair.vercel.app)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the FAIR3 Fairness Hackathon by the MustaFair team.
