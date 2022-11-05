// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Twilio from "twilio";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import crypto from "crypto";
import { Queue } from "bullmq";
import connection from "../../workers/connection";

import artifact from "../../contracts/artifacts/src/BEEPER.sol/BEEPER.json";

const mintQueue = new Queue("mint", { connection });

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

  console.log(isValidRequest);

  if (!isValidRequest) {
    res.setHeader("Content-Type", "text/xml");
    res.send(403);
    return;
  }

  const response = new Twilio.twiml.MessagingResponse();
  const provider = new ethers.providers.AlchemyProvider(
    "homestead",
    process.env.ALCHEMY_API_KEY
  );
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    artifact.abi,
    provider
  );

  const body: string = req.body.Body;
  const phone = req.body.From;

  let user = await prisma.user.upsert({
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

  if (body.toLowerCase().includes("beep boop")) {
    response.message(
      `🟢 Message received. Reply with your wallet address or ENS to intiate airdrop.`
    );
    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(response.toString());
    return;
  }

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

  if (wallet && !user.wallet) {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        wallet,
      },
    });
  }

  const walletBalance = await contract.balanceOf(user.wallet);

  // mint token to new wallets
  if (!user.hasClaimedAirdrop && user.wallet !== null && walletBalance === 0) {
    await mintQueue.add("mint", { wallet });

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hasClaimedAirdrop: true,
      },
    });

    response.message(`✈️ Wallet confirmed. Airdrop incoming...`);
    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(response.toString());
    return;
  }

  // existing holders recieve activation code
  if (user.wallet !== null && walletBalance > 0) {
    const code = generateUniqueCode();
    const host = req.headers.host;
    const activateUrl = `https://${host}?code=${code}`;
    response.message(`Activate your beeper: ${activateUrl}`);
    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(response.toString());
    return;
  }

  // fallback for unknown messages
  response.message(
    `🟢 Message received. Reply with your wallet address or ENS to intiate airdrop.`
  );
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(response.toString());
}
