import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUserByProvider } from "@/lib/db/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/app";
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" && user?.id && account) {
        const internalId = await upsertUserByProvider(user.id, {
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        });
        if (internalId) token.userId = internalId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { userId?: string }).userId = token.userId as string | undefined;
      }
      return session;
    },
  },
  trustHost: true,
});
