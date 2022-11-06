import { createApolloClient } from "../apollo/client";
import { gql } from "@apollo/client";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";

require("dotenv").config();

const getProfileQuery = gql`
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
      }
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
      query: getProfileQuery,
      variables: {
        request: {
          handle: "beeper.test",
        },
      },
    });
    console.log("profile: ", response);
  } catch (e) {
    /* handle error */
    console.log((e as any).networkError.result.errors);
  }
};

createLensProfile();
