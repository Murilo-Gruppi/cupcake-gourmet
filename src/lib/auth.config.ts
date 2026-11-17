/**
 * Configuração do next-auth v5 segura para Edge Runtime.
 * NÃO importar Prisma, bcryptjs ou qualquer módulo Node.js nativo aqui.
 * Este arquivo é usado pelo middleware.
 */
import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

// Augment dos tipos apenas com o que o Edge precisa
declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role as Role;
      return session;
    },
  },
  // Providers são adicionados em auth.ts (Node.js runtime)
  providers: [],
};
