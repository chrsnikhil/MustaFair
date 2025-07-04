import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { createHash } from 'crypto';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Generate identity hash for blockchain storage
        const identityData = {
          provider: account.provider,
          providerId:
            (profile as any).sub ||
            (profile as any).id ||
            account.providerAccountId,
          email: profile.email,
          name: profile.name,
          timestamp: Date.now(),
        };

        // Create SHA-256 hash of identity data
        const identityHash = createHash('sha256')
          .update(JSON.stringify(identityData))
          .digest('hex');

        token.identityHash = identityHash;
        token.identityData = identityData;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Add identity hash and data to session
      session.identityHash = token.identityHash as string;
      session.identityData = token.identityData as any;
      session.provider = token.provider as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
