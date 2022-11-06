import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import NextCors from "nextjs-cors";
import { Queue } from "bullmq";
import connection from "../../workers/connection";

const prisma = new PrismaClient();

const postQueue = new Queue("post", { connection });

const smsQueue = new Queue("sms", {
  connection: connection,
});

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

    const method = req.method;
    const url = req.url;
    const baseLog = `${method}: ${url}`;
    console.log(baseLog);

    if (method === "GET") {
      const wallet = req.query.wallet as string;

      if (!wallet) {
        console.log(baseLog + " fetching all messages...");
        const messages = await prisma.message.findMany({
          where: {
            to: null,
          },
          include: {
            userFrom: {
              select: {
                wallet: true,
              },
            },
            userTo: {
              select: {
                wallet: true,
              },
            },
          },
        });

        return res.status(200).send(messages);
      }

      const user = await prisma.user.findFirst({
        where: { wallet },
      });

      if (!user) return res.status(401).send("no wallet...");

      console.log(baseLog + "user found, fetching messages...");

      const response = await prisma.message.findMany({
        where: {
          to: user.id,
          OR: {
            from: user.id,
          },
        },
        include: {
          userFrom: {
            select: {
              wallet: true,
            },
          },
          userTo: {
            select: {
              wallet: true,
            },
          },
        },
      });

      console.log(baseLog + "found messages...");

      return res.status(200).send(response);
    }

    if (method === "POST") {
      console.log(baseLog + " creating message(s)...");
      const body = JSON.parse(req.body);
      const message = body.message;
      const from = body.from;
      const to = body.to;

      if (!to) {
        await postQueue.add("postToLens", {
          content: message,
          wallet: from,
        });
      }

      console.log({ from, to, message });

      const [fromUser, toUser] = await Promise.all([
        prisma.user.findFirst({ where: { wallet: from } }),
        prisma.user.findFirst({ where: { wallet: to } }),
      ]);

      if (!fromUser) return res.status(400).send("no wallet");

      const response = await prisma.message.create({
        data: {
          from: fromUser.id,
          to: to === null ? null : toUser?.id,
          text: message,
        },
      });

      if (response && to === null) {
        console.log(baseLog + " sending bulk...");
        smsQueue.add("sendBulk", {
          message: "You’ve got BEEPS! 📧",
        });
      }

      return res.status(200).send(response.id);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("oops");
  }
}
