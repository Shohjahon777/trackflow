import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Fetch extra fields from our User model
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { username: true, bio: true, githubUsername: true },
        });

        if (dbUser) {
          session.user.username = dbUser.username;
          session.user.bio = dbUser.bio;
          session.user.githubUsername = dbUser.githubUsername;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Auto-generate username from GitHub profile
      if (user.id) {
        const account = await db.account.findFirst({
          where: { userId: user.id, provider: "github" },
        });

        if (account) {
          // Fetch GitHub username via the provider account
          const res = await fetch("https://api.github.com/user/" + account.providerAccountId);
          if (res.ok) {
            const ghProfile = await res.json();
            const githubUsername = ghProfile.login;

            // Check if username is taken
            const existing = await db.user.findUnique({
              where: { username: githubUsername },
            });

            await db.user.update({
              where: { id: user.id },
              data: {
                githubUsername: githubUsername,
                username: existing ? null : githubUsername,
              },
            });
          }
        }
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});
