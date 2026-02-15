import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
            
            if (!response.ok) return null;
            
            console.log("response status: ", response.status);
            const data = await response.json();
            const token = data.access_token;
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            });
            
            const userData = await res.json();
            
            return {
              token,
              ...userData
            };
          }
          
          console.log('Invalid credentials');
          return null;
        }
    }),
  ],
});