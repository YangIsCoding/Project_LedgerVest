import NextAuth, { NextAuthOptions } from "next-auth"; // Import NextAuthOptions type
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
// Import PrismaAdapter if you decide to use database sessions later
// import { PrismaAdapter } from "@next-auth/prisma-adapter"; 

const prisma = new PrismaClient();

// Define custom types for Session and User if needed (you already have this)
declare module "next-auth" {
  interface User {
    username?: string;
    walletAddress?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      walletAddress?: string;
    };
  }
  interface JWT {
    walletAddress?: string;
  }
}

// ✅ Define and export authOptions
export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Uncomment if using database sessions
  session: {
    strategy: "jwt", // Or "database"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && user.password) {
          const isValid = await compare(credentials.password, user.password);
          if (isValid) {
            return user; // Return the full user object on success
          }
        }
        return null; // Return null on failure
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session: updateSessionData }) {
      // On initial sign in, add custom properties from user object
      if (user) {
        token.id = user.id;
        token.email = user.email; // email is usually included by default
        token.name = user.name; // name is usually included by default
        token.username = user.username;
        token.walletAddress = user.walletAddress;
      }
      // If username is missing on subsequent calls, try fetching it (optional, might be redundant if always set on sign-in)
      if (token.email && !token.username) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { username: true, walletAddress: true },
        });
        token.username = dbUser?.username || null;
        token.walletAddress = dbUser?.walletAddress || null;
      }
      if (trigger === "update" && updateSessionData) {
        console.log("JWT Callback: Handling 'update' trigger with data:", updateSessionData);
        if (typeof updateSessionData.username !== 'undefined') {
          token.username = updateSessionData.username; // Update token username
        }
        // Add similar checks if other fields can be updated
        // if (typeof updateSessionData.walletAddress !== 'undefined') { ... }
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom properties from token to the session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string; // Already present
        session.user.username = token.username as string | undefined; // Add username
        session.user.walletAddress = token.walletAddress as string | null; // Add wallet address
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) return false; // Need email from Google

        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (existingUser) {
          // User exists
          if (existingUser.authMethod === "oauth") {
            // Already linked via OAuth, allow sign-in
            return true;
          } else if (!existingUser.authMethod || existingUser.authMethod === "credentials") {
            // Exists via credentials, redirect to link page
            return `/link-account?email=${encodeURIComponent(existingUser.email)}`;
          }
        } else {
          // New user, redirect to register page
          return `/register?email=${encodeURIComponent(profile.email)}`;
        }
      }
      // Allow sign in for credentials or other providers
      return true;
    },
    async redirect({ url, baseUrl }) {
      const requestedUrl = new URL(url, baseUrl);

      // Handle explicit redirects FROM signIn callback (linking/new user registration)
      if (requestedUrl.pathname === '/link-account' || requestedUrl.pathname === '/register') {
        if (requestedUrl.searchParams.has('email')) {
          return requestedUrl.toString(); // Allow redirect to link/register
        }
      }

      // If signIn allowed login, BUT the original callbackUrl was '/register', redirect to home.
      if (requestedUrl.pathname === '/register' && !requestedUrl.searchParams.has('email')) {
        console.log("OAuth login successful, but originated from /register. Redirecting to /");
        return baseUrl; // Redirect to home page ('/')
      }

      // Standard redirect logic
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl; // Default redirect to home page
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add pages configuration if you have custom pages
  // pages: {
  //   signIn: '/login',
  //   error: '/auth/error', // Custom error page
  //   // signOut: '/auth/signout',
  //   // verifyRequest: '/auth/verify-request', // (used for email provider)
  //   // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  // }
};

// ✅ Pass the exported options to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };