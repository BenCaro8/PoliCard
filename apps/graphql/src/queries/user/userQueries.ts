import { QueryResolvers } from '#gql-types';
import { GraphQLContext } from '#gql-context';
import { client, getUserAttribute } from '../../utils/cognito';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { dbPool } from '../../utils/aws';

const isUserLoggedInTypeDef = `#graphql
  extend type Query {
    isUserLoggedIn: User
  }
`;

export const isUserLoggedInResolver: QueryResolvers['isUserLoggedIn'] = async (
  _,
  __,
  { req, authenticated }: GraphQLContext,
) => {
  const AccessToken = req.cookies?.access_token;
  if (!authenticated || !AccessToken) return null;

  const getUserCommand = new GetUserCommand({
    AccessToken: req.cookies?.access_token,
  });

  const user = await client.send(getUserCommand);

  return user
    ? {
        id: getUserAttribute(user, 'sub'),
        email: getUserAttribute(user, 'email'),
        name: getUserAttribute(user, 'preferred_username'),
      }
    : null;
};

const getUserTypeDef = `#graphql
  extend type Query {
    getUser: User @auth
  }
`;

export const getUserResolver: QueryResolvers['getUser'] = async (
  _,
  __,
  context,
) => {
  const { req, authenticated } = context;
  const AccessToken = req.cookies?.access_token;
  if (!authenticated || !AccessToken) return null;

  const getUserCommand = new GetUserCommand({
    AccessToken: req.cookies?.access_token,
  });

  const user = await client.send(getUserCommand);

  const userId = context.res.locals.userInfo.id;

  try {
    const userMetadata = await dbPool.one(
      'SELECT explorer_score FROM users WHERE user_id = ($1)',
      [userId],
    );

    return {
      id: getUserAttribute(user, 'sub'),
      email: getUserAttribute(user, 'email'),
      name: getUserAttribute(user, 'preferred_username'),
      ...userMetadata,
    };
  } catch (err) {
    console.log(err);
  }
};

export const typeDefs = [isUserLoggedInTypeDef, getUserTypeDef];
