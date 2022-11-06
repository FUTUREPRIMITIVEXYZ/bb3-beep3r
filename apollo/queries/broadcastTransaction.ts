import { gql } from "@apollo/client";

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

export default broadcastTransactionQuery;
