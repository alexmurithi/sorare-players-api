const dateScalar = require("../Utils/CustomDate");

const resolvers = {
    
  Date: dateScalar,

  Query: {
    text: () => "Hello There!",

    playerInfo: (_, { slug }, { dataSources }) =>
      dataSources.playerInfoAPI.getPlayerInfo(slug),
  },
};

module.exports = resolvers;
