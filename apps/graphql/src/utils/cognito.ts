import {
  CognitoIdentityProviderClient,
  GetUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';

import 'dotenv/config';

export const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
export const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

export const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const generateSecretHash = (username: string) => {
  const hasher = createHmac('sha256', CLIENT_SECRET || '');
  hasher.update(`${username}${CLIENT_ID}`);
  return hasher.digest('base64');
};

export const getUserAttribute = (
  user: GetUserCommandOutput,
  attrName: string,
): string =>
  user.UserAttributes?.find((attr) => attr.Name === attrName)?.Value || '';
