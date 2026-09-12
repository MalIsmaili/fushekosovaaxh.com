import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import type { Role } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        const role = String(credentials?.role ?? "");
        if (!email || !password) return null;

        // A single email can hold one account per role, so match on both when a
        // role is supplied; otherwise fall back to the first matching account.
        const user =
          role && ["COACH", "STUDENT", "PARENT"].includes(role)
            ? await prisma.user.findFirst({ where: { email, role: role as Role } })
            : await prisma.user.findFirst({ where: { email } });
        if (!user || !verifyPassword(password, user.passwordHash)) return null;
        if (user.banned) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? null;
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        token.role = dbUser?.role ?? null;
        token.name = dbUser?.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role | null | undefined) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
