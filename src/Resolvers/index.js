const dateScalar = require("../Utils/CustomDate");

const resolvers = {
  Date: dateScalar,

  Query: {
    async club(_, { slug }, { dataSources }, info) {
      const { after } = info.variableValues;

      return dataSources.playerInfoAPI.getPlayerInfo(slug, after);
    },
  },
};

module.exports = resolvers;
