import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import abi from "./abi.json";

const BEEPER_ADDRESS = process.env.BEEPER_ADDRESS || "";
const BOSS_WALLETS = process.env.BOSS_WALLETS || "";

const prisma = new PrismaClient();

const provider = new ethers.providers.AlchemyProvider(
  process.env.CHAIN,
  process.env.ALCHEMY_API_KEY
);

const contract = new ethers.Contract(BEEPER_ADDRESS, abi, provider);

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
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
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
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
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async signIn({ credentials }) {
        try {
          console.log("SIGNING MESSAGE...");
          const siwe = new SiweMessage(
            // @ts-ignore next-line
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");

          console.log("VERIFYING MESSAGE...");
          const result = await siwe.verify({
            // @ts-ignore next-line
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          console.log("GETTING CODE...");
          const statement = result.data.statement;
          const tuple = statement?.split(": ");

          if (!tuple) {
            return false;
          }

          const [, code] = tuple;

          if (
            !code &&
            BOSS_WALLETS.split(",").some((w) => w === result.data.address)
          ) {
            console.log("no code and is boss wallet");
            return true;
          }


          // console.log("CHECKING CONTRACT...");
          // const balance = await contract.balanceOf(result.data.address);
          // const balanceNumber = balance.toNumber();

          // if (!balanceNumber) {
          //   console.log(`Does not have beeper: ${result.data.address}`);
          //   return false;
          // }

          console.log("UPDATING USER...");

          const user = await prisma.user.findUnique({ where: { code } });

          if (!user || user.wallet !== result.data.address) {
            console.log(
              "error: USER DOES NOT EXIST OR CODE DOES NOT MATCH WALLET"
            );
            return false;
          }

          const updatedUser = await prisma.user.update({
            where: {
              code,
            },
            data: {
              verified: true,
            },
          });

          console.log("SUCCESS...");
          if (updatedUser) return true;
          console.log("FAILED...");

          return false;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub;
        session.user.name = token.sub;
        session.user.image = "https://www.fillmurray.com/128/128";
        return session;
      },
    },
  });
}
