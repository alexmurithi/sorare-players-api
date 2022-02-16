const { GraphQLDataSource } = require("apollo-datasource-graphql");
const { gql } = require("apollo-server-express");

const PLAYER_INFO = gql`
  query PLAYER_INFO($slug: String!, $after: String) {
    club(slug: $slug) {
      players(first: 50, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          # start node
          node {
            id
            displayName
            slug
            age
            birthDate
            position
            country {
              slug
              code
            }
            subscriptionsCount
            pictureUrl
            shirtNumber
            activeClub {
              id
              name
              pictureSecondaryUrl
              domesticLeague {
                id
                displayName
              }
            }
            status {
              id
              lastFifteenSo5Appearances
              lastFifteenSo5AverageScore
              lastFiveSo5Appearances
              lastFiveSo5AverageScore
              playingStatus
            }
            allSo5Scores {
              nodes {
                score
              }
            }
          } #end node
        }
      }
    }
  }
`;

class PlayerInfoAPI extends GraphQLDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.sorare.com/graphql/";
  }

  async getPlayerInfo(slug, after) {
    try {
      const response = await this.query(PLAYER_INFO, {
        variables: {
          slug,
          after,
        },
      });

      return this.playerInfoReducer(response.data.club.players);
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  playerInfoReducer(data) {
    return {
      players: {
        pageInfo: {
          endCursor: data.pageInfo.endCursor,
          startCursor: data.pageInfo.startCursor,
          hasNextPage: data.pageInfo.hasNextPage,
          hasPreviousPage: data.pageInfo.hasPreviousPage,
        },

        edges: data.edges.map((player) => ({
          node: {
            id: player.node.id,
            displayName: player.node.displayName,
            slug: player.node.slug,
            age: player.node.age,
            birthDate: player.node.birthDate,
            position: player.node.position,
            subscriptionsCount: player.node.subscriptionsCount,
            pictureUrl: player.node.pictureUrl,
            shirtNumber: player.node.shirtNumber,
            activeClub: player.node.activeClub
              ? {
                  id: player.node.activeClub.id,
                  name: player.node.activeClub.name,
                  pictureSecondaryUrl:
                    player.node.activeClub.pictureSecondaryUrl,
                  domesticLeague: player.node.activeClub.domesticLeague && {
                    id: player.node.activeClub.domesticLeague.id,
                    displayName:
                      player.node.activeClub.domesticLeague.displayName,
                  },
                }
              : null,
            allSo5Scores: {
              nodes: player.node.allSo5Scores.nodes.map((score) => ({
                score: score.score,
              })),
            },
            status: {
              id: player.node.status.id,
              lastFifteenSo5Appearances:
                player.node.status.lastFifteenSo5Appearances,
              lastFifteenSo5AverageScore:
                player.node.status.lastFifteenSo5AverageScore,
              lastFiveSo5Appearances: player.node.status.lastFiveSo5Appearances,
              lastFiveSo5AverageScore:
                player.node.status.lastFiveSo5AverageScore,
              playingStatus: player.node.status.playingStatus,
            },
            country: {
              code: player.node.country.code || player.country.slug,
            },
          },
        })),
      },
    };
  }
}

module.exports = PlayerInfoAPI;
