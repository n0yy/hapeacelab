import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/utils/firebase/config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getUser } from "@/lib/services/firebase/users";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
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

        // Cek jika user ada di Firestore
        const userRef = doc(db, "users", user.email);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            fullName: data.fullName,
            email: data.email,
            type: data.type,
            points: 300,
            createdAt: serverTimestamp(),
          });
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      const result = await getUser(token.email);
      if (token && token.email) {
        session.user.email = token.email;
        session.user.type = token.type;
        session.user.fullName = token.fullName;
        session.user.points = result?.points;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
