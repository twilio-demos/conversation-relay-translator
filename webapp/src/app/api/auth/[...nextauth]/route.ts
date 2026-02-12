import { Analytics } from "@segment/analytics-node";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY || "",
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          analytics.identify({
            userId: user.email,
            traits: {
              email: user.email,
              name: user.name,
              avatar: user.image,
            },
          });
          await analytics.flush();
          console.log("Segment identify call sent for:", user.email);
        } catch (error) {
          console.error("Failed to send Segment identify:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error id does exist
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
