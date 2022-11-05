// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Twilio from "twilio";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import crypto from "crypto";

const prisma = new PrismaClient();

function generateUniqueCode() {
  return crypto.randomBytes(8).toString("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isValidRequest = Twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    req.headers["x-twilio-signature"] as string,
    process.env.TWILIO_WEBHOOK_URL!,
    req.body
  );

  if (!isValidRequest) {
    res.send(200);
    return;
  }

  const response = new Twilio.twiml.MessagingResponse();
  const provider = new ethers.providers.AlchemyProvider(
    "homestead",
    process.env.ALCHEMY_API_KEY
  );

  console.log(req.body.Body);

  const body: string = req.body.Body;
  const phone = req.body.From;

  const includedWallet = body
    .split(" ")
    .filter((token) => token.includes("0x"))
    .map((address) => {
      try {
        return ethers.utils.getAddress(address);
      } catch (e) {
        return null;
      }
    })
    .filter((address) => address !== null)
    .at(0);

  const walletFromENS = await body
    .split(" ")
    .filter((token) => token.includes(".eth"))
    .map(async (ens) => {
      try {
        return await provider.resolveName(ens);
      } catch (e) {
        return null;
      }
    })
    .filter((address) => address !== null)
    .at(0);

  const wallet = includedWallet || walletFromENS;

  await prisma.user.upsert({
    where: {
      phone,
    },
    create: {
      phone,
    },
    update: {
      phone,
    },
  });

  if (wallet) {
    const code = generateUniqueCode();
    await prisma.user.update({
      where: {
        phone,
      },
      data: {
        wallet,
        code,
        verified: false,
      },
    });

    const host = req.headers.host;
    const requestUrl = `https://${host}?code=${code}`;

    console.log({ requestUrl });

    response.message(
      `🟢 Wallet confirmed. Airdrop in coming... Activate here ${requestUrl}`
    );
  } else {
    response.message(
      `🟢 Message received. Reply with your wallet address or ENS to enter.`
    );
  }

  res.setHeader("Content-Type", "text/xml");

  res.status(200).send(response.toString());
}
