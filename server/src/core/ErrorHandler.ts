import { badData, boomify, type Boom } from '@hapi/boom';
import { type Application, type NextFunction, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';

export const checkValidationResult = (req: Request, _res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const [error] = result.array({ onlyFirstError: true });
    next(badData((error.type === 'field' ? `${error.location}.${error.path}: ` : '') + error.msg));
  } else {
    next();
  }
};

export default (app: Application) => {
  app.get('/{*splat}', (_req, res) => {
    res.status(404).end();
  });
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (!(err as any).isBoom) {
      err = boomify(err);
    }
    const { output } = err as Boom;
    if (!res.headersSent) {
      res.status(output.statusCode).end();
    }
    if (output.statusCode === 500 && process.env.NODE_ENV === 'development') {
      console.error(err);
    }
  });
};
