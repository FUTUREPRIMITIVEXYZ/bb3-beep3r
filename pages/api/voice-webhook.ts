// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Twilio from "twilio";
import { PrismaClient } from "@prisma/client";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { sortBy } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isValidRequest = Twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    req.headers["x-twilio-signature"] as string,
    process.env.TWILIO_VOICE_WEBHOOK_URL!,
    req.body
  );

  if (!isValidRequest) {
    res.setHeader("Content-Type", "text/xml");
    res.send(403);
    return;
  }

  const response = new Twilio.twiml.VoiceResponse();

  const xmtpWallet = new ethers.Wallet(process.env.XMTP_PRIVATE_KEY!);

  const xmtp = await Client.create(xmtpWallet);

  const messages = [];

  const allConversations = await xmtp.conversations.list();

  for (const conversation of allConversations) {
    for await (const page of conversation.messagesPaginated({
      pageSize: 25,
    })) {
      for (const msg of page) {
        messages.push({
          userFrom: {
            wallet: msg.senderAddress,
          },
          text: msg.content,
          sent: msg.sent,
        });
      }
    }
  }

  const mostRecentBroadcasts = sortBy(messages, ["sent"]).slice(0, 3);

  const output = `greetings eeth SF hacker. this is mizuna from the BB3 mainframe. here are the most recent broadcasts: ${mostRecentBroadcasts
    .map(
      (broadcast: any) =>
        `from ${broadcast.userFrom.wallet
          .slice(0, 6)
          .split("")
          .join(" ")
          .replace("x", "ex")}: ${broadcast.text}`
    )
    .join("; ")}`;

  console.log(output);

  response.say(output);

  res.setHeader("Content-Type", "text/xml");

  res.status(200).send(response.toString());
}
