import { unauthorized } from '@hapi/boom';
import { type Request, type Response, type NextFunction } from 'express';
import { User, type UserDocument } from 'models';
import { type WebSocket } from 'ws';

export type AuthorizedRequest = Request & { user: UserDocument; };

type AuthorizedRequestHandler = (req: AuthorizedRequest, res: Response, next: NextFunction) => void;
type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

type AuthorizedWebsocketRequestHandler = (ws: WebSocket, req: AuthorizedRequest, next: NextFunction) => void;
type WebsocketRequestHandler = (ws: WebSocket, req: Request, next: NextFunction) => void;

const authenticate = (req: Request, next: NextFunction) => {
  let token;
  if (req.headers.authorization) {
    const [type, value] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      token = value;
    }
  } else if (req.query.auth) {
    token = req.query.auth.toString();
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
};

export const requireAuth = (handlers: AuthorizedRequestHandler[]) => [
  (req: Request, _res: Response, next: NextFunction) => (
    authenticate(req, next)
  ),
  ...(handlers as RequestHandler[])
];

export const requireAuthWS = (handlers: AuthorizedWebsocketRequestHandler[]) => [
  (_ws: WebSocket, req: Request, next: NextFunction) => (
    authenticate(req, next)
  ),
  ...(handlers as WebsocketRequestHandler[])
];
