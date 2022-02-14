const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");

const typeDefs = require("./src/Schemas/index");
const resolvers = require("./src/Resolvers/index");

const PlayerInfoAPI = require("./src/DataSources/PlayerInfo");

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    playerInfoAPI: new PlayerInfoAPI(),
  }),
});

const startUp = async () => {
  await server.start();

  const corsOptins = {
    origin: "*",
    credentials: true,
  };

  app.use(cors(corsOptins));
  server.applyMiddleware({ app, path: "/api" });
  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
};

startUp();
