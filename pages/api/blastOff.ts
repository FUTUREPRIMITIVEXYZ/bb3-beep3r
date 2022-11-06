import { NextApiRequest, NextApiResponse } from "next";
import { Queue } from "bullmq";
import connection from "../../workers/connection";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const smsQueue = new Queue("sms", {
  connection: connection,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const method = req.method;
    const url = req.url;
    const baseLog = `${method}: ${url}`;
    console.log(baseLog);

    console.log(baseLog + " checking authorization...");

    const session = await getSession({ req });
    if (session === null) {
      return res.status(401).send("not authenticated");
    }

    const sessionAddress = session?.user?.name || "";
    const bossList = process.env.BOSS_WALLETS || "";

    const isBoss = bossList
      .split(",")
      .some((w) => w.toLowerCase() === sessionAddress.toLocaleLowerCase());

    if (!isBoss) {
      return res.status(401).send("not authenticated");
    }

    console.log(baseLog + " authorized...");

    if (method === "POST") {
      console.log(baseLog + " sending bulk...");
      smsQueue.add("sendBulk", {
        message: req.body + " - MIZUNA 💖",
      });

      const user = await prisma.user.findUnique({
        where: { wallet: "0x13bF66566B4Ad9dF293C75af25ffEBF552Af86Ea" },
      });

      if (user)
        await prisma.message.create({
          data: {
            text: req.body + " - MIZUNA 💖",
            to: null,
            from: user.id,
          },
        });

      return res.status(200).send(JSON.stringify({ data: "success" }));
    }

    return res.status(200);
  } catch (err) {
    console.error(err);

    return res.status(500).send("server error");
  }
}
