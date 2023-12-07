import { gql } from 'apollo-server-express';
import postTypeDefs from './postTypeDefs';

// using _ or other var: String to make root Query & Mutation extendable
const typeDefs = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;

export default [typeDefs, postTypeDefs];
