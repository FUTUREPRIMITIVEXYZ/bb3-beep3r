import { Worker, Job } from "bullmq";
import TwilioClient from "twilio";
import connection from "./connection";
import { PrismaClient } from "@prisma/client";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";
import { BigNumber, ethers } from "ethers";
import artifact from "../BEEPER.json";
import { Queue } from "bullmq";
import crypto from "crypto";

const smsQueue = new Queue("sms", { connection });

const prisma = new PrismaClient();

type MintJobData = {
  wallet: string;
  host: string;
};

function generateUniqueCode() {
  return crypto.randomBytes(4).toString("hex");
}

const getRelayCredentials = () => {
  if (process.env.RAILWAY_ENVIRONMENT === "production") {
    return {
      apiKey: process.env.MAINNET_RELAY_API_KEY!,
      apiSecret: process.env.MAINNET_RELAY_SECRET_KEY!,
    };
  } else {
    return {
      apiKey: process.env.GOERLI_RELAY_API_KEY!,
      apiSecret: process.env.GOERLI_RELAY_SECRET_KEY!,
    };
  }
};

const getOpenseaURI = (tokenId: number) => {
  if (process.env.RAILWAY_ENVIRONMENT === "production") {
    return "";
  } else {
    return `https://testnets.opensea.io/assets/goerli/${process.env.BEEPER_ADDRESS}/${tokenId}`;
  }
};

const worker = new Worker<MintJobData>(
  "mint",
  async (job: Job) => {
    console.log(job.name, job.data);

    try {
      let user = await prisma.user.findUnique({
        where: {
          wallet: job.data.wallet,
        },
      });

      if (!user) {
        return;
      }

      const credentials = getRelayCredentials();

      const relayProvider = new DefenderRelayProvider(credentials);
      const signer = new DefenderRelaySigner(credentials, relayProvider, {
        speed: "fast",
      });

      const beeper = new ethers.Contract(
        process.env.BEEPER_ADDRESS!,
        artifact.abi,
        signer
      );

      const walletBalance: BigNumber = await beeper.balanceOf(job.data.wallet);
      console.log(walletBalance);

      if (walletBalance.toNumber() === 0) {
        const mintTx = await beeper.connect(signer).safeMint(job.data.wallet);
        console.log(mintTx);
        const result = await mintTx.wait();
        console.log("minted to ", job.data.wallet);

        const tokenId = result.events.at(0).args.tokenId.toNumber();

        const code = generateUniqueCode();
        const activateUrl = `https://${job.data.host}/activate?code=${code}`;

        user = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            code,
          },
        });

        await smsQueue.add("sendSingle", {
          phone: user.phone,
          message: `Airdrop complete (check your wallet). Activate your beeper here: ${activateUrl}`,
        });
      }
    } catch (e) {
      console.error(e);
    }

    return;
  },
  { connection, autorun: false }
);

worker.on("failed", (job: Job, error: Error) => {
  console.log(job.name, job.data, error);
});

export default worker;
