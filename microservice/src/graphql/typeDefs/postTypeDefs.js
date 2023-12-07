import { gql } from 'apollo-server-express';

const postTypeDefs = gql`
  type Post {
    description: String
    imageUrl: String
  }

  type PostResponse {
    name: String
    post: Post
  }

  input PostInput {
    description: String
    imageUrl: String
  }

  extend type Mutation {
    createPost(name: String, post: PostInput!): PostResponse
  }

  extend type Query {
    getPost: PostResponse
  }
`;

export default postTypeDefs;
