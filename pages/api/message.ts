import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const method = req.method;
    const url = req.url;
    const baseLog = `${method}: ${url}`;
    console.log(baseLog);

    if (method === "GET") {
      const wallet = req.query.wallet as string;

      if (!wallet) {
        console.log(baseLog + " fetching all messages...");
        const messages = await prisma.message.findMany({
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
        where: { to: user.id },
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
          to: toUser ? toUser.id : null,
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
