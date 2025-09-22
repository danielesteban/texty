
import { type Application } from 'express-ws';
import nocache from 'nocache';
import { requireAuth, requireAuthWS } from 'core/Auth';
import * as Scenario from 'services/Scenario';
import * as User from 'services/User';

const preventCache = nocache();

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

  app.delete(
    '/scenario/:id',
    preventCache,
    requireAuth(Scenario.remove)
  );

  app.get(
    '/scenarios',
    preventCache,
    Scenario.listAll
  );

  app.get(
    '/scenarios/user',
    preventCache,
    requireAuth(Scenario.listEditable)
  );

  app.get(
    '/scenario/:id/photo',
    preventCache,
    Scenario.photo
  );

  app.ws(
    '/scenario/:id',
    ...requireAuthWS(Scenario.editor),
  );
};
