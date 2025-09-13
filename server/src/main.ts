import { unauthorized } from '@hapi/boom';
import cors from 'cors';
import express  from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { allowedOrigins, mongoURI, port } from 'core/Config';
import setupErrorHandler from 'core/ErrorHandler';
import setupServices from 'services';

mongoose.connect(mongoURI);

const app = express();
app.use(helmet());
app.use(cors({
  origin: (origin, next) => {
    if (!origin || allowedOrigins.includes(origin)) {
      next(null, true);
    } else {
      next(unauthorized());
    }
  },
}));
app.use(express.json());

setupServices(app);
setupErrorHandler(app);

const server = app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    console.error(error);
  }
});

const shutdown = () => {
  server.close(async () => {
    await mongoose.connection.close();
    process.nextTick(() => process.exit(0));
  });
};
process
  .on('SIGTERM', shutdown)
  .on('SIGINT', shutdown);
