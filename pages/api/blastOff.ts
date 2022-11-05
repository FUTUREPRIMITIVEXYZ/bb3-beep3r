import { NextApiRequest, NextApiResponse } from "next";

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
      return res.status(200).send(JSON.stringify({ data: "success" }));
    }

    return res.status(200);
  } catch (err) {
    console.error(err);

    return res.status(500).send("server error");
  }
}
