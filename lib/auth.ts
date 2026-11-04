import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
    userId?: string;
  }
}

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dev-secret-change-in-production-openssl-rand-base64-32";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const normalizedEmail = email.toLowerCase().trim();

        try {
          const [user] = await db
            .select()
            .from(adminUsers)
            .where(eq(adminUsers.email, normalizedEmail))
            .limit(1);

          if (user && user.isActive) {
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (isValid) {
              // Update last login
              try {
                await db
                  .update(adminUsers)
                  .set({ lastLoginAt: new Date() })
                  .where(eq(adminUsers.id, user.id));
              } catch (updateErr) {
                console.warn("Failed to update last login timestamp:", updateErr);
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.avatar,
              };
            }
          }
        } catch (dbErr) {
          console.error("Database query failed during auth authorize:", dbErr);
        }

        // Environment fallback admin (for initial bootstrap or emergency access)
        const fallbackEmail = process.env.ADMIN_EMAIL || "arun@arun-m.in";
        const fallbackPassword = process.env.ADMIN_PASSWORD || "Admin@123";

        if (normalizedEmail === fallbackEmail.toLowerCase() && password === fallbackPassword) {
          return {
            id: "bootstrap-admin-id",
            email: fallbackEmail,
            name: "Arun M",
            role: "admin",
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
