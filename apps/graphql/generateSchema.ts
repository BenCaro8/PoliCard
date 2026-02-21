import { printSchema } from 'graphql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  typeDefs as queryTypeDefs,
  resolvers as queryResolvers,
} from './src/queries/queries';
import {
  typeDefs as mutationTypeDefs,
  resolvers as mutationResolvers,
} from './src/mutations/mutations';
import { typeDefs as typesTypeDefs } from './src/types/types';
import {
  directiveTransformer,
  directiveTypeDefs,
} from './src/utils/directives';

let schema = makeExecutableSchema({
  typeDefs: [queryTypeDefs, mutationTypeDefs, typesTypeDefs, directiveTypeDefs],
  resolvers: [queryResolvers, mutationResolvers],
});

schema = directiveTransformer(schema);

const schemaSDL = printSchema(schema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const graphqlOutputPath = path.join(__dirname, './schema.graphql');
const mobileOutputPath = path.join(__dirname, '../mobile/schema.graphql');
const webOutputPath = path.join(__dirname, '../web/schema.graphql');

fs.writeFileSync(graphqlOutputPath, schemaSDL);
fs.writeFileSync(mobileOutputPath, schemaSDL);
fs.writeFileSync(webOutputPath, schemaSDL);

console.log('GraphQL schema has been written to schema.graphql');
