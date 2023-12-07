/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import cors from 'cors';
import { disableFragmentWarnings } from 'graphql-tag';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { ENV } from './constant';

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.urlencoded({ extended: true })); // support encoded bodies

  // Disable warning fragment already exists
  disableFragmentWarnings();

  // apolloServer
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // -- Custom your context
      return {};
    },

    introspection: ENV.ENABLE_INTROSPECTION,
    persistedQueries: false,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: ENV.ENABLE_INTROSPECTION,
      }),
    ],
    tracing: true,
  });

  await apolloServer.start();
  // apollo server middleware
  apolloServer.applyMiddleware({
    app,
  });

  const httpServer = app.listen(3000, () => {
    console.log(`GraphQL Server Listening on Port 3000`);
    console.log('http://localhost:3000/graphql');
  });

  return httpServer;
};

startServer();
