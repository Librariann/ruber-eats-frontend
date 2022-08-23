import { gql, useQuery } from "@apollo/client";
import { MeQuery } from "../__api__/types";

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};

export default useMe;
