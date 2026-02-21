import { MutationResolvers } from '#gql-types';
import { GraphQLContext } from '#gql-context';
import { GraphQLError } from 'graphql';
import { dbPool } from '../../utils/aws';
import {
  SignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ConfirmSignUpCommand,
  GetUserCommand,
  GetUserCommandOutput,
  GlobalSignOutCommand,
  UsernameExistsException,
  ResendConfirmationCodeCommand,
  CodeDeliveryFailureException,
  UserNotConfirmedException,
  CodeMismatchException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  client,
  CLIENT_ID,
  getUserAttribute,
  generateSecretHash,
} from '../../utils/cognito';

import 'dotenv/config';

const isDevelopment = process.env.NODE_ENV === 'development';

const signUpUserTypeDef = `#graphql
  extend type Mutation {
    signUpUser(email: String!, displayName: String!, password: String!): Boolean
  }
`;

/**
 * Signs up a new user.
 *
 * This involves two main steps:
 * 1. Creating the user identity in AWS Cognito.
 * 2. Creating a corresponding user record in our local Postgres database.
 *
 * We link the two using Cognito's `UserSub` (Subject ID) as the `user_id` in our DB.
 */
export const signUpUserResolver: MutationResolvers['signUpUser'] = async (
  _,
  { email, displayName, password },
) => {
  console.log({ email, displayName, password });
  try {
    // 1. Create user in Cognito
    // SecretHash is required because the app client is configured with a client secret.
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'preferred_username',
          Value: displayName,
        },
      ],
      SecretHash: generateSecretHash(email),
    });
    const user = await client.send(command);

    // 2. Create user in local DB
    // If this fails, we have an orphaned Cognito user.
    try {
      await dbPool.none('INSERT INTO users (user_id) VALUES ($1)', [
        user.UserSub,
      ]);
      console.log('User created in database with ID:', user.UserSub);
    } catch (error) {
      console.error('Database Error on User Creation', error);
      throw new GraphQLError('Failed to create user in database');
    }
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      throw new GraphQLError(error.message);
    }
    // Note: Other errors might be swallowed here, returning 'true'.
  }

  return true;
};

const confirmSignUpTypeDef = `#graphql
  extend type Mutation {
    confirmSignUp(email: String!, password: String!, confirmationCode: String!): User
  }
`;

/**
 * Confirms a user's sign-up using the code sent to their email.
 *
 * UX Improvement: After successful confirmation, this resolver automatically
 * logs the user in (InitiateAuth) so they don't have to enter their credentials again immediately.
 */
export const confirmSignUpResolver: MutationResolvers['confirmSignUp'] = async (
  _,
  { email, password, confirmationCode },
  { res }: GraphQLContext,
) => {
  let user: GetUserCommandOutput;
  console.log({ email, confirmationCode });
  try {
    // 1. Confirm the user in Cognito
    const confirmSignUpCommand = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: generateSecretHash(email),
    });
    await client.send(confirmSignUpCommand);

    // 2. Auto-login: Initiate Auth to get tokens
    const initiateAuthCommand = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(email),
      },
    });

    const initiateAuthCommandResponse = await client.send(initiateAuthCommand);

    const { AccessToken, RefreshToken } =
      initiateAuthCommandResponse.AuthenticationResult || {};

    // 3. Fetch user details to return in the response
    const getUserCommand = new GetUserCommand({ AccessToken });

    user = await client.send(getUserCommand);

    // 4. Set session cookies
    // httpOnly prevents XSS attacks from reading the tokens
    // secure ensures cookies are only sent over HTTPS (in production)
    res.cookie('access_token', AccessToken, {
      httpOnly: true,
      secure: !isDevelopment,
      path: '/',
    });

    res.cookie('refresh_token', RefreshToken, {
      httpOnly: true,
      secure: !isDevelopment,
      path: '/',
    });
  } catch (error) {
    console.log(error);
    if (error instanceof CodeMismatchException) {
      throw new GraphQLError(error.message);
    }
    throw new GraphQLError('Something went wrong!');
  }

  return {
    id: getUserAttribute(user, 'sub'),
    email: getUserAttribute(user, 'email'),
    name: getUserAttribute(user, 'preferred_username'),
  };
};

const resendConfirmationCodeTypeDef = `#graphql
  extend type Mutation {
    resendConfirmationCode(email: String!): Boolean
  }
`;

/**
 * Resends the confirmation code to the user's email.
 * Useful if the code expired or was lost.
 */
export const resendConfirmationCodeResolver: MutationResolvers['resendConfirmationCode'] =
  async (_, { email }) => {
    console.log({ email });
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: CLIENT_ID,
        Username: email,
        SecretHash: generateSecretHash(email),
      });
      await client.send(command);

      return true;
    } catch (error) {
      if (error instanceof CodeDeliveryFailureException) {
        throw new GraphQLError(error.message);
      }
    }

    return false;
  };

const loginUserTypeDef = `#graphql
  extend type Mutation {
    loginUser(email: String!, password: String!): User
  }
`;

/**
 * Authenticates a user and establishes a session via cookies.
 */
export const loginUserResolver: MutationResolvers['loginUser'] = async (
  _,
  { email, password },
  { res }: GraphQLContext,
) => {
  let user: GetUserCommandOutput;
  console.log({ email, password });
  try {
    // 1. Authenticate against Cognito
    const initiateAuthCommand = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(email),
      },
    });
    const initiateAuthCommandResponse = await client.send(initiateAuthCommand);

    const { AccessToken, RefreshToken } =
      initiateAuthCommandResponse.AuthenticationResult || {};

    // 2. Get user profile
    const getUserCommand = new GetUserCommand({ AccessToken });

    user = await client.send(getUserCommand);

    res.locals = {
      ...res.locals,
      authenticated: true,
      userInfo: {
        id: getUserAttribute(user, 'sub'),
      },
    };

    // 3. Set secure cookies
    res.cookie('access_token', AccessToken, {
      httpOnly: true,
      secure: !isDevelopment,
      path: '/',
    });

    res.cookie('refresh_token', RefreshToken, {
      httpOnly: true,
      secure: !isDevelopment,
      path: '/',
    });
  } catch (error) {
    console.log(error);
    if (error instanceof UserNotConfirmedException) {
      throw new GraphQLError(error.message);
    }
    throw new GraphQLError('Something went wrong!');
  }

  return {
    id: getUserAttribute(user, 'sub'),
    email: getUserAttribute(user, 'email'),
    name: getUserAttribute(user, 'preferred_username'),
  };
};

const logoutUserTypeDef = `#graphql
  extend type Mutation {
    logoutUser: Boolean
  }
`;

/**
 * Logs out the user.
 *
 * Performs a global sign-out in Cognito (invalidating all tokens for the user)
 * and clears the local session cookies.
 */
export const logoutUserResolver: MutationResolvers['logoutUser'] = async (
  _,
  __,
  { req, res }: GraphQLContext,
) => {
  const accessToken = req.cookies?.access_token;
  // GlobalSignOut invalidates all access/refresh tokens issued to this user.
  const globalSignOutCommand = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });
  await client.send(globalSignOutCommand);
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  return true;
};

export const typeDefs = [
  signUpUserTypeDef,
  confirmSignUpTypeDef,
  resendConfirmationCodeTypeDef,
  loginUserTypeDef,
  logoutUserTypeDef,
];