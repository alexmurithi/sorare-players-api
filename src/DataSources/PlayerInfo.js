const { GraphQLDataSource } = require("apollo-datasource-graphql");
const { gql } = require("apollo-server-express");

const PLAYER_INFO = gql`
  query PLAYER_INFO($slug: String!) {
    club(slug: $slug) {
      players {
        nodes {
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
          allSo5Scores(first: 50) {
            nodes {
              score
            }
          }
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

  async getPlayerInfo(slug) {
    try {
      const response = await this.query(PLAYER_INFO, {
        variables: {
          slug,
        },
      });

      // console.log(response.data.club.players.nodes);

      return Array.isArray(response.data.club.players.nodes)
        ? response.data.club.players.nodes.map((player) =>
            this.playerInfoReducer(player)
          )
        : [];
    } catch (err) {
      console.log(err);
    }
  }

  playerInfoReducer(player) {
    return {
      id: player.id,
      displayName: player.displayName,
      slug: player.slug,
      age: player.age,
      birthDate: player.birthDate,
      position: player.position,
      country: {
        code: player.country.code || player.country.slug,
      },
      subscriptionsCount: player.subscriptionsCount,
      pictureUrl: player.pictureUrl,
      shirtNumber: player.shirtNumber,
      status: {
        id: player.status.id,
        lastFifteenSo5Appearances: player.status.lastFifteenSo5Appearances,
        lastFifteenSo5AverageScore: player.status.lastFifteenSo5AverageScore,
        lastFiveSo5Appearances: player.status.lastFiveSo5Appearances,
        lastFiveSo5AverageScore: player.status.lastFiveSo5AverageScore,
        playingStatus: player.status.playingStatus,
      },
      allSo5Scores: {
        nodes: player.allSo5Scores.nodes.map((score) => ({
          score: score.score,
        })),
      },
      activeClub: player.activeClub
        ? {
            id: player.activeClub.id,
            name: player.activeClub.name,
            pictureSecondaryUrl: player.activeClub.pictureSecondaryUrl,
            domesticLeague: player.activeClub.domesticLeague && {
              id: player.activeClub.domesticLeague.id,
              displayName: player.activeClub.domesticLeague.displayName,
            },
          }
        : null,
    };
  }
}

module.exports = PlayerInfoAPI;
