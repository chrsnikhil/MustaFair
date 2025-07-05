import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyMessage } from 'viem';
import { createHash } from 'crypto';

export const CarvIdProvider = CredentialsProvider({
  id: 'carv-id',
  name: 'CARV ID',
  credentials: {
    address: { label: 'Wallet Address', type: 'text' },
    tokenId: { label: 'Token ID', type: 'text' },
    signature: { label: 'Signature', type: 'text' },
    message: { label: 'Message', type: 'text' },
    metadata: { label: 'Metadata', type: 'text' },
    web2Achievements: { label: 'Web2 Achievements', type: 'text' },
  },
  async authorize(credentials) {
    if (!credentials?.address || !credentials?.signature || !credentials?.message || !credentials?.tokenId) {
      throw new Error('Missing required credentials');
    }

    try {
      // Verify the signature
      const isValid = await verifyMessage({
        address: credentials.address as `0x${string}`,
        message: credentials.message,
        signature: credentials.signature as `0x${string}`,
      });

      if (!isValid) {
        throw new Error('Invalid signature');
      }

      // Parse metadata and achievements
      const metadata = credentials.metadata ? JSON.parse(credentials.metadata) : null;
      const web2Achievements = credentials.web2Achievements ? JSON.parse(credentials.web2Achievements) : null;

      // Create identity data for CARV ID user
      const identityData = {
        provider: 'carv-id',
        providerId: credentials.tokenId,
        tokenId: credentials.tokenId,
        address: credentials.address,
        metadata,
        web2Achievements,
        timestamp: Date.now(),
      };

      // Generate identity hash
      const identityHash = createHash('sha256')
        .update(JSON.stringify(identityData))
        .digest('hex');

      // Return user object
      return {
        id: credentials.tokenId,
        name: metadata?.name || `CARV ID #${credentials.tokenId}`,
        email: credentials.address, // Use address as email-like identifier
        image: metadata?.image || null,
        tokenId: credentials.tokenId,
        address: credentials.address,
        identityHash,
        identityData,
        provider: 'carv-id',
        metadata,
        web2Achievements,
      };
    } catch (error) {
      console.error('CARV ID authentication error:', error);
      throw new Error('Authentication failed');
    }
  },
});
