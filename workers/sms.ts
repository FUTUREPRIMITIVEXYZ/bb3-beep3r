import { Worker, Job } from "bullmq";
import TwilioClient from "twilio";
import connection from "./connection";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SMSJobData = {
  message: string;
  phone?: string;
};

const worker = new Worker<SMSJobData>(
  "sms",
  async (job: Job) => {
    console.log(job.name, job.data);

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = TwilioClient(accountSid, authToken);

    if (job.name === "sendSingle" && job.data.phone) {
      console.log(process.env.TWILIO_PHONE_NUMBER);
      try {
        const result = await client.messages.create({
          body: job.data.message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: job.data.phone,
        });
        console.log(result);
      } catch (e) {
        /* handle error */
        console.error(e);
      }
    }

    if (job.name === "sendBulk") {
      const allUsers = await prisma.user.findMany();

      await Promise.all(
        allUsers.map(async (user) => {
          try {
            const result = await client.messages.create({
              body: job.data.message,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: user.phone,
            });
            console.log(result);
          } catch (e) {
            /* handle error */
            console.error(e);
          }
        })
      );
    }
  },
  { connection, autorun: false }
);

export default worker;
