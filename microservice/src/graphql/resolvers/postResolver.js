import { combineResolvers } from 'graphql-resolvers';
import { controllerCallback } from '../../middleware';
import { createPost, getPost } from '../../controllers';

const postResolvers = {
  Mutation: {
    createPost: combineResolvers(
      // --Can apply middleware here
      async (_, args, context) => {
        return await controllerCallback(createPost, args);
      }
    ),
  },
  Query: {
    getPost: combineResolvers(
      // --Can apply middleware here
      async (_, _args, context) => {
        return await controllerCallback(getPost);
      }
    ),
  },
};

export default postResolvers;
