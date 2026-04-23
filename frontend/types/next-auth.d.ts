/**
 * @file frontend/types/next-auth.d.ts
 * @description Modulo TypeScript del proyecto.
 * @symbols N/A
 */

import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            username: string
            role: string
            accessToken: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        username: string
        role: string
        token: string // The token returned from the backend login
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: string
        username: string
        role: string
        accessToken: string
    }
}
