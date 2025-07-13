import { keccak_256 } from "js-sha3";

export function getIdentityHash(user: any, wallet: string, web2Achievements?: any) {
  const identityData = {
    ...user,
    wallet,
    web2Achievements: web2Achievements ? {
      totalScore: web2Achievements.totalScore,
      overallTier: web2Achievements.overallTier,
      achievementHash: web2Achievements.achievementHash,
      providers: web2Achievements.providers?.map((p: any) => ({
        provider: p.provider,
        score: p.achievements.score,
        tier: p.achievements.tier
      })),
      badges: web2Achievements.combinedBadges,
      lastUpdated: web2Achievements.metadata.lastUpdated
    } : null
  };
  return "0x" + keccak_256(JSON.stringify(identityData));
}

export function validateCarvIdAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatCarvIdTokenId(tokenId: bigint | number): string {
  return `CARV-${tokenId.toString().padStart(6, '0')}`;
} 