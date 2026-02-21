import { Request, Response, NextFunction } from 'express';
import {
  AuthFlowType,
  InitiateAuthCommand,
  NotAuthorizedException,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { JwtExpiredError } from 'aws-jwt-verify/error';
import {
  client,
  CLIENT_ID,
  COGNITO_USER_POOL_ID,
  generateSecretHash,
} from './cognito';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';

import 'dotenv/config';

const isDevelopment = process.env.NODE_ENV === 'development';

const verifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID || '',
  tokenUse: 'access',
  clientId: CLIENT_ID,
});

const authenticate = async (
  access_token?: string,
): Promise<CognitoAccessTokenPayload | undefined> => {
  if (!access_token) return;

  const payload = await verifier.verify(access_token, {
    clientId: CLIENT_ID || '',
  });

  return payload;
};

const decodeToken = (token: string): CognitoAccessTokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');

    return JSON.parse(payload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const handleTokenRefresh = async (
  req: Request,
  res: Response,
): Promise<CognitoAccessTokenPayload | undefined> => {
  const { access_token, refresh_token } = req.cookies;
  if (!access_token || !refresh_token) return;

  const payload = decodeToken(access_token);

  const initiateAuthCommand = new InitiateAuthCommand({
    ClientId: CLIENT_ID,
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    AuthParameters: {
      REFRESH_TOKEN: refresh_token,
      SECRET_HASH: generateSecretHash(payload?.username || ''),
    },
  });

  const initiateAuthCommandResponse = await client.send(initiateAuthCommand);

  const { AccessToken } =
    initiateAuthCommandResponse.AuthenticationResult || {};

  res.cookie('access_token', AccessToken, {
    httpOnly: true,
    secure: !isDevelopment,
    path: '/',
  });

  // Propagate down the new access token as this IS a valid request
  req.cookies.access_token = AccessToken;

  return await authenticate(AccessToken);
};

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let decodedToken: CognitoAccessTokenPayload | undefined;

  try {
    decodedToken = await authenticate(req.cookies.access_token);
  } catch (err) {
    if (err instanceof JwtExpiredError) {
      try {
        decodedToken = await handleTokenRefresh(req, res);
      } catch (err) {
        if (err instanceof NotAuthorizedException) {
          console.log(err.message);
        }
      }
    }
  }

  if (decodedToken) {
    const { sub } = decodedToken;
    res.locals = {
      ...res.locals,
      authenticated: true,
      userInfo: {
        id: sub || '',
      },
    };
  } else {
    res.locals = {
      ...res.locals,
      authenticated: false,
    };
  }

  next();
};
