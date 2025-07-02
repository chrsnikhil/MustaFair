import 'next-auth';

declare module 'next-auth' {
  interface Session {
    identityHash?: string;
    identityData?: {
      provider: string;
      providerId: string;
      email?: string | null;
      name?: string | null;
      timestamp: number;
    };
    provider?: string;
  }

  interface JWT {
    identityHash?: string;
    identityData?: {
      provider: string;
      providerId: string;
      email?: string | null;
      name?: string | null;
      timestamp: number;
    };
    provider?: string;
  }
}
