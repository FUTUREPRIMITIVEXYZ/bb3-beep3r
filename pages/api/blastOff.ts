import { NextApiRequest, NextApiResponse } from "next";
// import Twilio from "twilio";
// import { Queue } from "bullmq";

// const sendEmailQueue = new Queue("sendAuthEmail", {
//   connection: new IORedis(process.env.REDIS_URL),
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const method = req.method;
    const url = req.url;
    const baseLog = `${method}: ${url}`;
    console.log(baseLog);

    if (method === "POST") {
      // TODO:  send this via twillio
      // const response = new Twilio.twiml.MessagingResponse();
      // response.message(req.body);

      return res.status(200).send(JSON.stringify({ data: "success" }));
    }

    return res.status(200);
  } catch (err) {
    console.error(err);

    return res.status(500).send("server error");
  }
}
