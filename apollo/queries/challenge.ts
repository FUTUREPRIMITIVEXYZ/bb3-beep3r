import { gql } from "@apollo/client";

const challengeQuery = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

export default challengeQuery;
