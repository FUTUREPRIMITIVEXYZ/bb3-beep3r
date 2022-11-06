import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import NextCors from "nextjs-cors";
import { Queue } from "bullmq";
import connection from "../../workers/connection";

const postQueue = new Queue("post", { connection });

const prisma = new PrismaClient();

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

    const session = await getSession({ req });
    if (session === null) {
      return res.status(401).send("not authenticated");
    }

    const sessionAddress = session?.user?.name || "";

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

      if (sessionAddress.toLowerCase() !== from.toLowerCase())
        return res.status(401).send("Bad request");

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

      return res.status(200).send(response.id);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("oops");
  }
}
