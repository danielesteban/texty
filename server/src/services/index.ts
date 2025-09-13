
import { type Application } from 'express';
import multer from 'multer';
import nocache from 'nocache';
import { requireAuth } from 'core/Auth';
import * as Scenario from 'services/Scenario';
import * as User from 'services/User';

const preventCache = nocache();
const upload = multer({ storage: multer.memoryStorage() });

export default (app: Application) => {
  app.get(
    '/user',
    preventCache,
    requireAuth(User.refreshSession)
  );

  app.put(
    '/user',
    preventCache,
    User.login
  );

  app.post(
    '/user',
    preventCache,
    User.register
  );

  app.get(
    '/scenario',
    preventCache,
    Scenario.load
  );

  app.put(
    '/scenario',
    preventCache,
    upload.single('data'),
    requireAuth(Scenario.save)
  );
};
