import { ApolloServer, gql } from 'apollo-server-express';
import { disableFragmentWarnings } from 'graphql-tag';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { mergeSchemas } from '@graphql-tools/schema';
import express from 'express';
import cors from 'cors';
import { getRemoteSchemaListAction } from './controllers/remoteSchema';
import { ENV } from './constant';

const startServer = async () => {
  // get all microservices
  // localhost domain
  const microservices = [
    { prefix: 'service1', url: 'http://localhost:4000/graphql' },
    { prefix: 'service2', url: 'http://localhost:5000/graphql' },
  ];

  // traefix domain
  // const microservices = [
  //   { prefix: 'service1', url: 'http://api.service1.localhost/graphql' },
  //   { prefix: 'service2', url: 'http://api.service2.localhost/graphql' },
  // ];

  // container name
  // const microservices = [
  //   { prefix: 'service1', url: 'http://service1.api:3000/graphql' },
  //   { prefix: 'service2', url: 'http://service2.api:3000/graphql' },
  // ];

  // In cast schemasList is empty, Query root type must be provided
  const remoteSchema = {
    typeDefs: gql`
      type Query {
        _: String
      }
    `,
  };

  // get list of various remote schemas
  const schemasList = await getRemoteSchemaListAction(microservices);
  if (schemasList.length) {
    remoteSchema.schema = mergeSchemas({ schemas: schemasList });
  }

  const app = express();
  // Body parser
  app.use(express.json());
  app.use(cors({ origin: '*' }));

  // Disable warning fragment already exists
  disableFragmentWarnings();

  // Create ApolloServer instance
  const server = new ApolloServer({
    ...remoteSchema,
    context: async ({ req }) => {
      // -- Custom your context
      return {
        token: req.headers.authorization,
        serviceCode: req.headers['service-code'],
      };
    },
    introspection: ENV.ENABLE_INTROSPECTION,
    cacheControl: false,
    persistedQueries: false,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: ENV.ENABLE_INTROSPECTION,
      }),
    ],
    tracing: true,
  });

  await server.start();
  server.applyMiddleware({ app, cors: { origin: '*' } });

  // -- If you change or add new mutation or query please reload new schema
  // eslint-disable-next-line consistent-return
  app.get('/reload-schema', async (_, res) => {
    try {
      const latestMicroservices = microservices;
      if (latestMicroservices) {
        const schemasListUpdated = await getRemoteSchemaListAction(
          latestMicroservices
        );
        const mergedUpdateSchemas = mergeSchemas({
          schemas: schemasListUpdated,
        });
        const schemaDerivedData =
          server.generateSchemaDerivedData(mergedUpdateSchemas);

        server.config.schema = mergedUpdateSchemas;
        server.state.schemaManager.schemaDerivedData = schemaDerivedData;

        return res.status(200).json({
          code: 200,
          message: 'successfully reloaded.',
        });
        // eslint-disable-next-line no-else-return
      } else {
        return res.status(500).json({
          code: 500,
          message:
            'Problem occur while trying to fetch all latest microservice.',
        });
      }
    } catch (err) {
      return res.status(500).json({
        code: 500,
        message: 'Something went wrong.',
      });
    }
  });

  // Start server
  const httpServer = app.listen(3000, () => {
    console.log(`API Gateways Server Listening on Port: 3000`);
    console.log('http://localhost:3000/graphql');
  });

  return httpServer;
};

startServer();
