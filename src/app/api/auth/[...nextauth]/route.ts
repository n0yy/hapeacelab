import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }: any) {
      if (account?.provider === "google") {
        const data = {
          fullName: user.name,
          email: user.email,
          type: "google",
        };
        token.fullName = data.fullName;
        token.email = data.email;
        token.type = data.type;
        console.log(`Data from Google: ${JSON.stringify(data)}`);
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.email = token.email;
        session.user.type = token.type;
        session.user.fullName = token.fullName;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
