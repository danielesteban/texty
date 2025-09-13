
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

  app.post(
    '/scenario',
    preventCache,
    requireAuth(Scenario.create)
  );

  app.get(
    '/scenario/:id',
    preventCache,
    Scenario.load
  );

  app.put(
    '/scenario/:id',
    preventCache,
    upload.single('data'),
    requireAuth(Scenario.save)
  );

  app.delete(
    '/scenario/:id',
    preventCache,
    requireAuth(Scenario.remove)
  );

  app.get(
    '/scenarios',
    preventCache,
    Scenario.list
  );

  app.get(
    '/scenario/:id/photo',
    preventCache,
    Scenario.photo
  );
};
