import { gql } from "@apollo/client";

const authenticateQuery = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export default authenticateQuery;
