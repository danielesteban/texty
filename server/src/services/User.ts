import { badRequest, unauthorized } from '@hapi/boom';
import { type NextFunction, type Request, type Response } from 'express';
import { body, matchedData } from 'express-validator';
import { type AuthorizedRequest } from 'core/Auth';
import { checkValidationResult } from 'core/ErrorHandler';
import { User } from 'models';

export const login = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 15 }),
  body('password')
    .trim()
    .notEmpty(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = matchedData<{ name: string; password: string }>(req);
    User
      .findOne({
        name,
        password: { $exists: true },
      })
      .then(async (user) => {
        if (!user || !(await user.comparePassword(password))) {
          throw unauthorized();
        }
        res.json(await user.getSession());
      })
      .catch(next);
  },
];

export const refreshSession = [
  (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    req.user.getSession()
      .then((session) => res.json(session))
      .catch(next);
  },
];

export const register = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 15 }),
  body('password')
    .trim()
    .notEmpty(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = matchedData<{ name: string; password: string }>(req);
    User.create({
      name,
      password,
    })
      .then((user) => user.getSession())
      .then((session) => res.json(session))
      .catch((err) => (
        next(err.code === 11000 ? badRequest() : err)
      ));
  },
];
