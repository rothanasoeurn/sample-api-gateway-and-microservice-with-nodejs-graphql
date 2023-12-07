import { gql } from 'apollo-server-express';
import { wrapSchema, schemaFromExecutor } from '@graphql-tools/wrap';
import { makeExecutableSchema } from '@graphql-tools/schema';

export const executableSchema = async (executor, schemaTransforms = []) => {
  const typeDefs = gql`
    type Query {
      _: String
    }
  `;

  try {
    const schema = wrapSchema({
      schema: await schemaFromExecutor(executor),
      executor,
      transforms: schemaTransforms,
    });

    return schema;
  } catch (err) {
    return makeExecutableSchema({ typeDefs });
  }
};
