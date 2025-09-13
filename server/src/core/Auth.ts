import { unauthorized } from '@hapi/boom';
import { type Request, type Response, type NextFunction } from 'express';
import { User, type UserDocument } from 'models';

export type AuthorizedRequest = Request & { user: UserDocument; };
type AuthorizedRequestHandler = (req: AuthorizedRequest, res: Response, next: NextFunction) => void;
type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

export const requireAuth = (handlers: AuthorizedRequestHandler[]) => [
  (req: Request, _res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization) {
      const [type, value] = req.headers.authorization.split(' ');
      if (type === 'Bearer') {
        token = value;
      }
    }
    if (!token) {
      throw unauthorized();
    }
    User
      .fromToken(token)
      .then((user) => {
        (req as AuthorizedRequest).user = user;
        next();
      })
      .catch((err) => next(unauthorized(err)))
  },
  ...(handlers as RequestHandler[])
];
