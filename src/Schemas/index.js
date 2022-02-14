const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Query {
    text: String!
    playerInfo(slug: String!): [PlayerInfo!]
  }

  type PlayerInfo {
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

  type Club {
    id: ID!
    name: String!
    pictureSecondaryUrl: String
    domesticLeague:DomesticLeague
  }

  type So5ScoreConnection {
    nodes: [So5Score!]!
  }

  type So5Score {
    score: Float
  }
  type DomesticLeague{
    id:ID!
    displayName:String!
  }
`;

module.exports = typeDefs;
