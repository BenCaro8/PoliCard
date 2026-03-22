import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { expressMiddleware } from '@apollo/server/express4';
import { tokenMiddleware } from './utils/middleware';
import { dbConnectionReady } from './utils/db';
import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import {
  typeDefs as queryTypeDefs,
  resolvers as queryResolvers,
} from './queries/queries';
import {
  typeDefs as mutationTypeDefs,
  resolvers as mutationResolvers,
} from './mutations/mutations';
import {
  typeDefs as typeTypeDefs,
  typeResolvers as typeTypeResolvers,
} from './types/types';
import { directiveTransformer, directiveTypeDefs } from './utils/directives';
import { GraphQLContext } from '#gql-context';

import 'dotenv/config';

const ADDR = process.env.LOCAL_ADDR || 'http://localhost';
const PORT = Number(process.env.LOCAL_PORT) || 4000;
const GRAPHQL = process.env.GRAPHQL_ROUTE || '/graphql';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors<cors.CorsRequest>({
    origin: [`${ADDR}:${process.env.LOCAL_WEB_PORT}`],
    credentials: true,
  }),
);

let schema = makeExecutableSchema({
  typeDefs: [queryTypeDefs, mutationTypeDefs, typeTypeDefs, directiveTypeDefs],
  resolvers: [queryResolvers, mutationResolvers, typeTypeResolvers],
});

schema = directiveTransformer(schema);

const server = new ApolloServer({ schema });

await server.start();

app.use(
  GRAPHQL,
  bodyParser.json(),
  express.json(),
  (req: Request, res: Response, next: NextFunction) =>
    tokenMiddleware(req, res, next),
  // @ts-expect-error Weird type mis-match...
  expressMiddleware<GraphQLContext>(server, {
    context: async ({ req, res }) => {
      return { ...res.locals, res, req };
    },
  }),
);

app.get('/health', async (_, res) => {
  try {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: '{ _empty }',
    });

    if (response.status === 200) {
      res.status(200).send('healthy');
    } else {
      res.status(500).send('Health check failed');
    }
  } catch (error) {
    res.status(500).send('Health check failed');
  }
});

app.get('/ready', (_, res) => {
  if (dbConnectionReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at ${ADDR}:${PORT}${GRAPHQL}`);
});
