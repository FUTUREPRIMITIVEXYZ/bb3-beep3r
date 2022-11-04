// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Twilio from "twilio";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = new Twilio.twiml.MessagingResponse();

  console.log(req.body.Body);

  const phone = req.body.From;

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

  response.message("loading beep3r...");

  res.setHeader("Content-Type", "text/xml");

  res.status(200).send(response.toString());
}
