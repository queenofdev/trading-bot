import { ApolloClient, InMemoryCache, gql, createHttpLink } from "@apollo/client";

import { GRAPH_URL } from "../constants/basic";

const clientInstance = () => {
  return new ApolloClient({
    link: createHttpLink({ uri: GRAPH_URL }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
};

export const apolloClient = (queryString: string) => {
  return clientInstance()
    .query({
      query: gql(queryString),
    })
    .then((data?: any) => {
      return data;
    })
    .catch((err) => console.error("Graph query error: ", err));
};
