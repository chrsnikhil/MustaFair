# @mustafair/reputation-sdk

The official SDK for integrating CARV ID authentication and MustaFair reputation systems into decentralized applications.

[![npm version](https://badge.fury.io/js/@mustafair%2Freputation-sdk.svg)](https://badge.fury.io/js/@mustafair%2Freputation-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔐 **CARV ID Authentication** - Seamless Web3 identity verification
- 🏆 **Reputation System** - Access on-chain reputation NFTs and scoring
- 🌐 **Multi-chain Support** - BSC Testnet and local development
- 📊 **Comprehensive APIs** - Query profiles, leaderboards, and statistics
- 🔗 **Web2 Integration** - GitHub and Google account binding
- 🛠️ **Developer Friendly** - TypeScript support with full type safety
- ⚡ **Performance Optimized** - Batch operations and caching

## Installation

```bash
npm install @mustafair/reputation-sdk

# With yarn
yarn add @mustafair/reputation-sdk

# With pnpm
pnpm add @mustafair/reputation-sdk
```

### Peer Dependencies

If you're building a Web3 dApp, you'll likely want to install these peer dependencies:

```bash
npm install viem wagmi
```

## Quick Start

### Basic Usage (Public APIs Only)

```typescript
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';

// Initialize the SDK
const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app');

// Get user's reputation profile
const profile = await sdk.getProfile('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3');
console.log('Reputation Score:', profile.reputation?.contributionScore);

// Check if user has a CARV ID
const hasIdentity = await sdk.hasCarvId('0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3');

// Get leaderboard
const leaderboard = await sdk.getLeaderboard({
  tier: 'Gold',
  sortBy: 'score',
  limit: 10
});
```

### With CARV ID Authentication

```typescript
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';
import { useAccount, useSignMessage } from 'wagmi';

const sdk = new Fair3ReputationSDK('https://musta-fair.vercel.app', 10000, {
  contractAddress: '0x742B6A2A5e29Ad0C20a78B5b6dE55fB2E8B1e8C3',
  chainId: 97 // BSC Testnet
});

// Initialize with wallet connection
const { address, isConnected, chainId } = useAccount();
const { signMessageAsync } = useSignMessage();

await sdk.initialize({
  address: address!,
  isConnected,
  chainId: chainId!
});

// Authenticate with CARV ID
const authResult = await sdk.authenticateWithCarvId(
  (message) => signMessageAsync({ message }),
  {
    fetchMetadata: true,
    fetchWeb2Achievements: true
  }
);

if (authResult.success) {
  console.log('Authentication successful:', authResult.user);
} else {
  console.error('Authentication failed:', authResult.error);
}
```

## API Reference

### Constructor

```typescript
new Fair3ReputationSDK(baseUrl?, timeout?, authConfig?)
```

- `baseUrl` (optional): API base URL (default: 'https://musta-fair.vercel.app')
- `timeout` (optional): Request timeout in ms (default: 10000)
- `authConfig` (optional): CARV ID authentication configuration

### Core Methods

#### Profile & Identity

```typescript
// Get complete user profile
const profile = await sdk.getProfile(address: string): Promise<FullProfileData>

// Get CARV ID profile only
const carvId = await sdk.getCarvIdProfile(address: string): Promise<CarvIdProfile>

// Get reputation data only
const reputation = await sdk.getReputation(address: string): Promise<ReputationData | null>

// Check if user has CARV ID
const hasId = await sdk.hasCarvId(address: string): Promise<boolean>

// Check if user has reputation NFT
const hasRep = await sdk.hasReputation(address: string): Promise<boolean>
```

#### Leaderboards & Statistics

```typescript
// Get paginated leaderboard
const leaderboard = await sdk.getLeaderboard(filters?: LeaderboardFilters): Promise<LeaderboardData>

// Get platform statistics
const stats = await sdk.getStats(): Promise<PlatformStats>

// Get top performers by tier
const topUsers = await sdk.getTopPerformers(tier?: string, limit?: number): Promise<LeaderboardEntry[]>
```

#### Authentication (Web3 Integration Required)

```typescript
// Initialize SDK with wallet connection
await sdk.initialize(walletConnection?: WalletConnection): Promise<void>

// Set wallet connection
sdk.setWalletConnection(connection: WalletConnection): void

// Authenticate with CARV ID
const result = await sdk.authenticateWithCarvId(
  signMessage: (message: string) => Promise<string>,
  options?: AuthOptions
): Promise<AuthenticationResult>

// Check if wallet is ready for authentication
const isReady = sdk.isWalletReady(): boolean
```

#### Utility Methods

```typescript
// Validate Ethereum addresses
const { valid, invalid } = Fair3ReputationSDK.validateAddresses(addresses: string[])

// Check reputation requirements
const check = await sdk.checkReputationRequirements(address: string, requirements: Requirements)

// Batch fetch profiles
const profiles = await sdk.getBatchProfiles(addresses: string[], options?: BatchOptions)

// Get tier numeric value
const tierValue = Fair3ReputationSDK.getTierValue(tier: string): number

// Format score with suffix
const formatted = Fair3ReputationSDK.formatScore(score: number): string
```

## Type Definitions

### Core Interfaces

```typescript
interface ReputationData {
  tokenId: string;
  contributionScore: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierLevel: number;
  creationDate: string;
  carvIdLinked: boolean;
  carvIdHash: string;
  isActive: boolean;
  metadata: any;
  contractAddress: string;
}

interface CarvIdData {
  tokenId: string;
  metadata: any;
  contractAddress: string;
  isValid: boolean;
}

interface Web2Binding {
  provider: 'github' | 'google';
  username?: string;
  email?: string;
  verified: boolean;
  linkedAt: string;
}

interface FullProfileData {
  wallet: string;
  reputation: ReputationData | null;
  carvId: CarvIdData | null;
  web2Achievements: Web2Achievements | null;
  network: string;
  chainId: number;
  contracts: {
    reputationNFT?: string;
    carvId?: string;
  };
  timestamp: string;
}
```

### Authentication Interfaces

```typescript
interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId: number;
  connector?: any;
}

interface CarvIdAuthConfig {
  contractAddress: string;
  chainId: number;
  requiredChains?: number[];
  signMessageTemplate?: string;
}

interface AuthenticationResult {
  success: boolean;
  user?: {
    address: string;
    tokenId: string;
    signature: string;
    message: string;
    metadata?: any;
    web2Achievements?: any;
    identityHash: string;
  };
  error?: string;
}
```

## Integration Examples

### React + Wagmi

```typescript
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';
import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';

function MyComponent() {
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [sdk] = useState(() => new Fair3ReputationSDK());
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isConnected && address) {
      sdk.initialize({ address, isConnected, chainId: chainId! });
      loadProfile();
    }
  }, [isConnected, address, chainId]);

  const loadProfile = async () => {
    try {
      const userProfile = await sdk.getProfile(address!);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const authenticate = async () => {
    try {
      const result = await sdk.authenticateWithCarvId(
        (message) => signMessageAsync({ message })
      );
      
      if (result.success) {
        console.log('Authenticated!', result.user);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <div>
      {profile?.reputation && (
        <div>
          <h3>Reputation: {profile.reputation.tier}</h3>
          <p>Score: {profile.reputation.contributionScore}</p>
        </div>
      )}
      <button onClick={authenticate}>Authenticate with CARV ID</button>
    </div>
  );
}
```

### Node.js Backend

```typescript
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';

const sdk = new Fair3ReputationSDK();

// API endpoint to get user reputation
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

// Check if user meets requirements
app.post('/api/check-requirements', async (req, res) => {
  const { address, requirements } = req.body;
  
  const check = await sdk.checkReputationRequirements(address, requirements);
  res.json(check);
});
```

### Vue.js + Viem

```typescript
import { Fair3ReputationSDK } from '@mustafair/reputation-sdk';
import { createWalletClient, custom } from 'viem';
import { bscTestnet } from 'viem/chains';

export default {
  data() {
    return {
      sdk: new Fair3ReputationSDK(),
      wallet: null,
      profile: null
    };
  },
  
  async mounted() {
    await this.connectWallet();
  },
  
  methods: {
    async connectWallet() {
      if (window.ethereum) {
        this.wallet = createWalletClient({
          chain: bscTestnet,
          transport: custom(window.ethereum)
        });
        
        const [address] = await this.wallet.getAddresses();
        
        await this.sdk.initialize({
          address,
          isConnected: true,
          chainId: bscTestnet.id
        });
        
        this.profile = await this.sdk.getProfile(address);
      }
    },
    
    async authenticate() {
      const result = await this.sdk.authenticateWithCarvId(
        async (message) => {
          const [address] = await this.wallet.getAddresses();
          return await this.wallet.signMessage({
            account: address,
            message
          });
        }
      );
      
      if (result.success) {
        console.log('Authenticated!', result.user);
      }
    }
  }
};
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```typescript
try {
  const profile = await sdk.getProfile(address);
} catch (error) {
  if (error.message.includes('Invalid address')) {
    // Handle invalid address
  } else if (error.message.includes('timeout')) {
    // Handle timeout
  } else {
    // Handle other errors
  }
}
```

## Constants

The SDK exports useful constants:

```typescript
import { FAIR3_CONSTANTS } from '@mustafair/reputation-sdk';

console.log(FAIR3_CONSTANTS.SUPPORTED_CHAINS);
console.log(FAIR3_CONSTANTS.CONTRACT_ADDRESSES);
console.log(FAIR3_CONSTANTS.TIER_VALUES);
console.log(FAIR3_CONSTANTS.API_ENDPOINTS);
```

## Development

### Building from Source

```bash
git clone https://github.com/chrsnikhil/MustaFair.git
cd MustaFair/sdk
npm install
npm run build
```

### Testing

```bash
npm run test
```

## Support

- **Documentation**: [https://musta-fair.vercel.app/docs](https://musta-fair.vercel.app/docs)
- **GitHub Issues**: [https://github.com/chrsnikhil/MustaFair/issues](https://github.com/chrsnikhil/MustaFair/issues)
- **Demo**: [https://musta-fair.vercel.app](https://musta-fair.vercel.app)

## Related Projects

- [MustaFair Platform](https://musta-fair.vercel.app) - The main platform
- [CARV Protocol](https://carv.io) - The underlying identity protocol

---