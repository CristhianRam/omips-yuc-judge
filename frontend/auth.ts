import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string().min(1), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/token`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            let message = 'Invalid credentials.';
            try {
              const errorData = await response.json();
              if (typeof errorData?.detail === 'string') {
                message = errorData.detail;
              }
            } catch {
              // Keep default message
            }
            throw new Error(message);
          }

          const data = await response.json();
          const token = data.access_token;

          const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!res.ok) return null;

          const userData = await res.json();
          return {
            token, // This maps to user.token in the jwt callback
            ...userData // hash id, username, role, email
          };
        }
        return null;
      }
    }),
  ],
});
