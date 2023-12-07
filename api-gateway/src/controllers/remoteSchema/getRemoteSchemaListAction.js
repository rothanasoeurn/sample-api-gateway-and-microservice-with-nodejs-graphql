import { print } from 'graphql';
import { RenameTypes, RenameRootFields } from '@graphql-tools/wrap';
import { executableSchema, httpPost } from '../../utils';

const remoteSchemaListAction = async (microservices = []) => {
  const schemas = [];
  for (let i = 0; i < microservices.length; i += 1) {
    if (microservices[i].url) {
      const { prefix, url } = microservices[i];
      // eslint-disable-next-line no-unused-vars
      const executor = async ({ document, variables, context }) => {
        // -- Do authenicate or something if you want

        // -- Do what you want in your headers
        const config = {
          headers: {},
        };

        const query = print(document);
        const bodyParams = JSON.stringify({ query, variables });
        const response = await httpPost(url, bodyParams, config);

        // add log if there is error
        return response.status === 200 ? response.data : response;
      };

      const schemaTransforms = [
        new RenameTypes((type) => {
          // If rename type CacheControlScope it will error "Unable to merge GraphQL directive "cacheControl"
          let renameType = `${prefix}_${type}`;
          if (type === 'CacheControlScope') {
            renameType = type;
          }
          return renameType;
        }),

        new RenameRootFields((operation, name) => `${prefix}_${name}`),
      ];

      const executable = await executableSchema(executor, schemaTransforms);
      schemas.push(executable);
    }
  }
  return schemas;
};

export default remoteSchemaListAction;
