import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import NextCors from "nextjs-cors";
import { Queue } from "bullmq";
import connection from "../../workers/connection";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { ethers } from "ethers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await NextCors(req, res, {
      // Options
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    if (req.method === "GET") {
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

      return res
        .status(200)
        .json(
          messages.sort(
            (a, b) => a.sent.getMilliseconds() - b.sent.getMilliseconds()
          )
        );
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("oops");
  }
}
