import { Client, Conversation } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";

import { Queue } from "bullmq";
import connection from "./connection";
require("dotenv").config();

const postQueue = new Queue("post", { connection });
const smsQueue = new Queue("sms", {
  connection: connection,
});

const prisma = new PrismaClient();

async function main() {
  const xmtpWallet = new ethers.Wallet(process.env.XMTP_PRIVATE_KEY!);

  const xmtp = await Client.create(xmtpWallet);

  const bossList = process.env.BOSS_WALLETS || "";

  while (true) {
    try {
      for await (const message of await xmtp.conversations.streamAllMessages()) {
        console.log(
          `New message from ${message.senderAddress}: ${message.content}`
        );

        const fromUser = await prisma.user.findFirst({
          where: { wallet: message.senderAddress },
        });

        if (fromUser) {
          const isBoss = bossList
            .split(",")
            .some(
              (w) => w.toLowerCase() === message.senderAddress.toLowerCase()
            );

          const response = await prisma.message.create({
            data: {
              from: fromUser.id,
              to: null,
              text: isBoss ? message.content + " - MIZUNA 💖" : message.content,
            },
          });

          console.log(response);

          await postQueue.add("postToLens", {
            content: message.content,
            wallet: message.senderAddress,
          });

          if (isBoss) {
            smsQueue.add("sendBulk", {
              message: message.content + " - MIZUNA 💖",
            });
          } else {
            await smsQueue.add("sendBulk", {
              message: "You’ve got BEEPS! 📧",
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
      break;
    }
  }
}

main();
