import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { SiweMessage } from "siwe";

import { prisma } from "../../../server/db/client";
import type { IncomingMessage } from "http";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub;
      session.user.name = token.sub;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL as string);
          console.log(req.headers);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            // getCsrfToken needs just req.headers.cookie, req has it
            // see: https://github.com/nextauthjs/next-auth/blob/2c669b32fc51ede4ed334384fbdbe01dc1cce9cc/packages/next-auth/src/client/_utils.ts#L40
            nonce: await getCsrfToken({
              req: req as unknown as IncomingMessage,
            }),
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
