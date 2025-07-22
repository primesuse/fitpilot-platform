// File: /src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" }
      },
      async authorize(credentials) {
        console.log('Auth attempt for:', credentials?.email, 'Type:', credentials?.userType);
        
        if (!credentials?.email || !credentials?.password || !credentials?.userType) {
          console.log('Missing credentials');
          return null;
        }

        try {
          let user = null;
          
          if (credentials.userType === 'pt') {
            user = await prisma.personalTrainer.findUnique({
              where: { email: credentials.email }
            });
          } else if (credentials.userType === 'client') {
            user = await prisma.client.findUnique({
              where: { email: credentials.email }
            });
          }

          if (!user) {
            console.log('No user found with email:', credentials.email);
            return null;
          }

          const passwordValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!passwordValid) {
            console.log('Password mismatch');
            return null;
          }

          console.log('Auth successful for user:', user.id);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: credentials.userType
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.userType = token.userType as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};
