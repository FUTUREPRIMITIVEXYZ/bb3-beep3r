import { NextApiRequest, NextApiResponse } from "next";
import { Queue } from "bullmq";
import connection from "../../workers/connection";

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

    if (method === "POST") {
      console.log(baseLog + " sending bulk...");
      smsQueue.add("sendBulk", {
        message: req.body,
      });

      return res.status(200).send(JSON.stringify({ data: "success" }));
    }

    return res.status(200);
  } catch (err) {
    console.error(err);

    return res.status(500).send("server error");
  }
}
