import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { createHash } from 'crypto';
import { CarvIdProvider } from '@/lib/carv-id-provider';

export const authOptions = {
  providers: [
    CarvIdProvider,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile'
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      // Handle CARV ID authentication
      if (user && account?.provider === 'carv-id') {
        token.identityHash = (user as any).identityHash;
        token.identityData = (user as any).identityData;
        token.provider = 'carv-id';
        token.tokenId = (user as any).tokenId;
        token.address = (user as any).address;
        token.metadata = (user as any).metadata;
        token.web2Achievements = (user as any).web2Achievements;
        return token;
      }

      // Handle Web2 providers (GitHub, Google)
      if (account && profile) {
        // Store access token for API calls
        token.accessToken = account.access_token;
        
        // Extract GitHub username or Google email
        let username = '';
        if (account.provider === 'github') {
          username = (profile as any).login || '';
        } else if (account.provider === 'google') {
          username = profile.email || '';
        }

        // Generate identity hash for blockchain storage including Web2 achievements
        const identityData = {
          provider: account.provider,
          providerId:
            (profile as any).sub ||
            (profile as any).id ||
            account.providerAccountId,
          email: profile.email,
          name: profile.name,
          username: username,
          timestamp: Date.now(),
        };

        // Create SHA-256 hash of identity data
        const identityHash = createHash('sha256')
          .update(JSON.stringify(identityData))
          .digest('hex');

        token.identityHash = identityHash;
        token.identityData = identityData;
        token.provider = account.provider;
        token.username = username;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Add identity hash and data to session
      session.identityHash = token.identityHash as string;
      session.identityData = token.identityData as any;
      session.provider = token.provider as string;
      session.accessToken = token.accessToken as string;
      session.username = token.username as string;
      
      // Add CARV ID specific data
      if (token.provider === 'carv-id') {
        (session as any).tokenId = token.tokenId;
        (session as any).address = token.address;
        (session as any).metadata = token.metadata;
        (session as any).web2Achievements = token.web2Achievements;
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
