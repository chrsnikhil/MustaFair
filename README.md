# MustaFair

## Decentralized Reputation and Content Curation Platform

MustaFair is a cutting-edge platform that bridges Web2 achievements with Web3 identity through CARV ID integration. Built for the FAIR3 Fairness Hackathon, it promotes technological fairness through algorithmic transparency, data sovereignty, and decentralized reputation systems.

## 🌟 Key Features

### Web2 Achievement Binding
- **GitHub Integration**: Automatically analyzes commits, pull requests, repositories, and programming languages
- **Google Account Data**: Processes account age, email activity, and service usage (privacy-protected)
- **Cryptographic Proofs**: Generates verifiable hashes of Web2 activities without exposing raw data
- **On-Chain Storage**: Binds achievement metadata to CARV ID NFTs on BNB Testnet

### CARV ID (ERC-7231) Implementation
- **Modular Identity**: Combines Web2 and Web3 identities in a single NFT
- **Reputation Tiers**: Bronze, Silver, Gold, and Platinum based on achievement scores
- **Badge System**: Dynamic achievement badges for different platforms and milestones
- **Zero-Knowledge Privacy**: Verifiable achievements without data exposure

### Industrial Design System
- **Pure Black/White Aesthetics**: Brutalist design for industrial-grade interfaces
- **Framer Motion Animations**: Smooth, professional interactions
- **Responsive Design**: Mobile-first approach with desktop optimization

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
git clone https://github.com/yourusername/MustaFair.git
cd MustaFair
npm install
```

### Environment Setup
Create a `.env` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BNB_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js with GitHub/Google OAuth
- **Blockchain**: Wagmi, Ethers.js, BNB Testnet
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **APIs**: RESTful APIs for achievement data processing

### Web2 Achievement Flow
1. **OAuth Authentication** - Secure login with GitHub/Google
2. **Data Collection** - Fetch contribution and activity data
3. **Score Calculation** - Weighted algorithm assigns points and tiers
4. **Hash Generation** - Cryptographic proof of achievements
5. **On-Chain Binding** - Store metadata in CARV ID contract

## 📊 Achievement System

### GitHub Metrics
- **Commits**: Total contributions across repositories
- **Pull Requests**: Created and merged PRs
- **Repositories**: Public repository ownership
- **Languages**: Programming language diversity
- **Social**: Followers and community engagement

### Scoring Algorithm
```typescript
GitHub Score = (commits × 2) + (PRs × 10) + (repos × 20) + (followers × 3)
Google Score = (account_age ÷ 10) + (email_activity ÷ 100) + storage_usage
Combined Score = GitHub Score + Google Score
```

### Tier Requirements
- **Bronze**: 0-999 points
- **Silver**: 1000-1999 points
- **Gold**: 2000-2999 points
- **Platinum**: 3000+ points

## 🔗 Smart Contract Integration

### ModularCarvID Contract
```solidity
contract ModularCarvID is ERC721, Ownable {
    mapping(uint256 => bytes32) private _web2AchievementHash;
    mapping(uint256 => string) private _reputationTier;
    
    function mintCarvId(bytes32 identitiesRoot) external;
    function updateWeb2Achievements(bytes32 achievementHash, string memory tier) external;
    function getReputationData(address wallet) external view returns (...);
}
```

### Deployment
```bash
cd hardhat
npx hardhat compile
npx hardhat run scripts/deploy.js --network bscTestnet
```

## 🔧 API Reference

### Achievement APIs

#### Get GitHub Contributions
```http
GET /api/github/contributions?username={username}
```

#### Get Google Achievements
```http
GET /api/google/achievements?email={email}
```

#### Aggregate Web2 Achievements
```http
POST /api/web2/achievements
Content-Type: application/json

{
  "identities": [
    { "provider": "github", "username": "user" },
    { "provider": "google", "email": "user@example.com" }
  ]
}
```

#### Get Reputation by Address
```http
GET /api/reputation/{wallet_address}
```
## 🔒 Privacy & Security

### Privacy Features
- **Hashed Storage**: Only cryptographic proofs on-chain
- **Selective Disclosure**: User controls shared data
- **Time-Based Hashing**: Prevents replay attacks
- **OAuth 2.0**: Secure third-party authentication

### Security Measures
- **Input Validation**: Sanitized user inputs
- **Rate Limiting**: API abuse prevention
- **Digital Signatures**: Data integrity verification
- **Smart Contract Auditing**: OpenZeppelin standards
