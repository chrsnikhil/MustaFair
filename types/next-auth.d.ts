import 'next-auth';

declare module 'next-auth' {
  interface Session {
    identityHash?: string;
    identityData?: {
      provider: string;
      providerId: string;
      email?: string | null;
      name?: string | null;
      username?: string;
      timestamp: number;
      // CARV ID specific fields
      tokenId?: string;
      address?: string;
      metadata?: any;
      web2Achievements?: any;
    };
    provider?: string;
    accessToken?: string;
    username?: string;
    // CARV ID specific session fields
    tokenId?: string;
    address?: string;
    metadata?: any;
    web2Achievements?: any;
  }

  interface JWT {
    identityHash?: string;
    identityData?: {
      provider: string;
      providerId: string;
      email?: string | null;
      name?: string | null;
      username?: string;
      timestamp: number;
      // CARV ID specific fields
      tokenId?: string;
      address?: string;
      metadata?: any;
      web2Achievements?: any;
    };
    provider?: string;
    accessToken?: string;
    username?: string;
    // CARV ID specific JWT fields
    tokenId?: string;
    address?: string;
    metadata?: any;
    web2Achievements?: any;
  }
}
