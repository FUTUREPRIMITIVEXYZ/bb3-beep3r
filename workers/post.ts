import { Worker, Job } from "bullmq";
import connection from "./connection";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";
import { createApolloClient } from "../apollo/client";
import { NFTStorage, Blob } from "nft.storage";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

import challengeQuery from "../apollo/queries/challenge";
import authenticateQuery from "../apollo/queries/authenticate";
import broadcastTransactionQuery from "../apollo/queries/broadcastTransaction";
import createPostQuery from "../apollo/queries/createPost";

type PostJobData = {
  content: string;
  sender: string;
};

const worker = new Worker<PostJobData>(
  "post",
  async (job: Job) => {
    console.log(job.name, job.data);

    const credentials = {
      apiKey: process.env.GOERLI_RELAY_API_KEY!,
      apiSecret: process.env.GOERLI_RELAY_SECRET_KEY!,
    };
    const relayProvider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, relayProvider, {
      speed: "fast",
    });

    const unauthClient = createApolloClient();

    const challengeResponse = await unauthClient.query({
      query: challengeQuery,
      variables: {
        request: {
          address: process.env.GOERLI_RELAY_ADDRESS,
        },
      },
    });
    console.log("challenge: ", challengeResponse);

    const signature = await signer.signMessage(
      challengeResponse.data.challenge.text
    );

    console.log(signature);

    const authResponse = await unauthClient.mutate({
      mutation: authenticateQuery,
      variables: {
        request: {
          address: process.env.GOERLI_RELAY_ADDRESS,
          signature,
        },
      },
    });

    console.log("auth: ", authResponse);

    const accessToken = authResponse.data.authenticate.accessToken;

    const authClient = createApolloClient(accessToken);
    const nftStorageClient = new NFTStorage({
      token: process.env.NFT_STORAGE_TOKEN!,
    });
    const metadata = {
      version: "2.0.0",
      name: "Beeper Broadcast",
      metadata_id: uuidv4(),
      description: "A message sent on the https://beeper.bb3.xyz network",
      content: job.data.content,
      locale: "en-US",
      mainContentFocus: "TEXT_ONLY",
    };
    const content = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const cid = await nftStorageClient.storeBlob(content);

    console.log(cid);

    const typedDataResponse = await authClient.mutate({
      mutation: createPostQuery,
      variables: {
        profileId: "0x5107",
        contentURI: `ipfs://${cid}`,
      },
    });

    console.log(typedDataResponse.data.createPostTypedData.id);
    console.log(typedDataResponse.data.createPostTypedData.typedData);
    const { domain, types, value } =
      typedDataResponse.data.createPostTypedData.typedData;

    delete domain.__typename;
    delete types.__typename;
    delete value.__typename;

    const broadcastSignature = await signer._signTypedData(
      domain,
      types,
      value
    );

    const broadcastResponse = await authClient.mutate({
      mutation: broadcastTransactionQuery,
      variables: {
        request: {
          id: typedDataResponse.data.createPostTypedData.id,
          signature: broadcastSignature,
        },
      },
    });

    console.log(broadcastResponse);
  },
  { connection, autorun: false }
);

worker.on("failed", (job: Job, error: Error) => {
  console.log(job.name, job.data, error);
});

export default worker;
