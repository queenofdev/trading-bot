import { gql } from "graphql-request";

export const tradeEventQuery = gql`
  query {
    bets {
      id
      market
      round
      timeframeId
      user
      hash
      amount
      position
      claimed
      claimedAmount
      claimedHash
      createdAt
      updatedAt
      block
      market
      round
      timeframeId
      user
      hash
      amount
      position
      claimed
      claimedAmount
      claimedHash
      createdAt
      updatedAt
      block
    }
  }
`;
