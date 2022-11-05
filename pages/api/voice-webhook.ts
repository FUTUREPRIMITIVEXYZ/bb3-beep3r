// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Twilio from "twilio";
import { PrismaClient } from "@prisma/client";

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

  response.say(
    "greetings eeth SF hacker. this is mizuna from the BB3 mainframe. you have been selected to participate in the beep3r experiment. Text your wallet address or ENS to this number to begin. Goodbye."
  );

  res.setHeader("Content-Type", "text/xml");

  res.status(200).send(response.toString());
}
