const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Query {
    text: String!
    club(slug: String!): Club!
  }

  type Club {
    id: ID!
    name: String!
    pictureSecondaryUrl: String
    domesticLeague: DomesticLeague
    players(first: Int, after: String): PlayerConnection!
  }

  type PlayerConnection {
    edges: [playerEdge!]!
    nodes: [Player!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
  }

  type Player {
    id: ID!
    displayName: String!
    slug: String!
    age: Int!
    birthDate: Date
    position: String!
    country: Country!
    subscriptionsCount: Int!
    pictureUrl: String
    shirtNumber: Int
    status: PlayerStatus!
    activeClub: Club
    allSo5Scores: So5ScoreConnection!
  }

  type playerEdge {
    cursor: String!
    node: Player
  }

  type Country {
    code: String!
  }

  type PlayerStatus {
    id: ID!
    lastFifteenSo5Appearances: Int
    lastFifteenSo5AverageScore: Float
    lastFiveSo5Appearances: Int
    lastFiveSo5AverageScore: Float
    playingStatus: String
  }

  type So5ScoreConnection {
    nodes: [So5Score!]!
  }

  type So5Score {
    score: Float
  }
  type DomesticLeague {
    id: ID!
    displayName: String!
  }
`;

module.exports = typeDefs;
