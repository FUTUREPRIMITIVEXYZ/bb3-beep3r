import { createApolloClient } from "../apollo/client";
import { gql } from "@apollo/client";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";

import { NFTStorage, Blob } from "nft.storage";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

const createPostQuery = gql`
  mutation CreatePostTypedData($profileId: ProfileId!, $contentURI: Url!) {
    createPostTypedData(
      request: {
        profileId: $profileId
        contentURI: $contentURI
        collectModule: { revertCollectModule: true }
        referenceModule: { followerOnlyReferenceModule: false }
      }
    ) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;

const broadcastTransactionQuery = gql`
  mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
      ... on RelayerResult {
        txHash
        txId
      }
      ... on RelayError {
        reason
      }
    }
  }
`;

const challengeQuery = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

const authenticateQuery = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export const createLensProfile = async () => {
  const credentials = {
    apiKey: process.env.GOERLI_RELAY_API_KEY!,
    apiSecret: process.env.GOERLI_RELAY_SECRET_KEY!,
  };
  const relayProvider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, relayProvider, {
    speed: "fast",
  });

  const unauthClient = createApolloClient();

  try {
    const response = await unauthClient.query({
      query: challengeQuery,
      variables: {
        request: {
          address: process.env.GOERLI_RELAY_ADDRESS,
        },
      },
    });
    console.log("challenge: ", response);

    const signature = await signer.signMessage(
      (response as any).data.challenge.text
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
      content: "hello world!",
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
  } catch (e) {
    /* handle error */
    console.log(e);
    // console.log((e as any).networkError.result.errors);
  }
};

createLensProfile();
