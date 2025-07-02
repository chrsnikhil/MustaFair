import { createHash } from 'crypto';

export interface IdentityData {
  provider: string;
  providerId: string;
  email?: string | null;
  name?: string | null;
  timestamp: number;
}

/**
 * Generate a deterministic hash for identity data that can be stored on-chain
 * This hash will be used to link OAuth identities to wallet addresses via ERC-7231
 */
export function generateIdentityHash(identityData: IdentityData): string {
  // Create a canonical string representation
  const canonicalData = {
    provider: identityData.provider.toLowerCase(),
    providerId: identityData.providerId,
    email: identityData.email?.toLowerCase() || null,
    name: identityData.name || null,
    timestamp: identityData.timestamp,
  };

  // Generate SHA-256 hash
  return createHash('sha256')
    .update(JSON.stringify(canonicalData))
    .digest('hex');
}

/**
 * Verify that an identity hash matches the provided data
 */
export function verifyIdentityHash(
  identityData: IdentityData,
  expectedHash: string,
): boolean {
  const computedHash = generateIdentityHash(identityData);
  return computedHash === expectedHash;
}

/**
 * Create a message for signing that includes both identity hash and wallet address
 * This will be used for the ERC-7231 binding process
 */
export function createBindingMessage(
  identityHash: string,
  walletAddress: string,
): string {
  return `Link identity ${identityHash} to wallet ${walletAddress.toLowerCase()}`;
}

/**
 * Parse identity data from a session or authentication result
 */
export function parseIdentityData(
  provider: string,
  profile: any,
  timestamp?: number,
): IdentityData {
  return {
    provider: provider.toLowerCase(),
    providerId: profile.sub || profile.id || profile.login,
    email: profile.email,
    name: profile.name || profile.login,
    timestamp: timestamp || Date.now(),
  };
}
