import { Response, Request } from 'express';

type UserInfo = {
  id: string;
};

export type GraphQLContext = {
  userInfo?: UserInfo;
  authenticated: boolean;
  roles: string[];
  res: Response;
  req: Request;
};
