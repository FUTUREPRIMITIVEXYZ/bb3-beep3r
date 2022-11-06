import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

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
      const users = await prisma.user.findMany({
        where: {
          verified: true,
          hasClaimedAirdrop: true,
        },
      });

      return res.status(200).send(users);
    }

    return res.status(200).send("nothing else here");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
