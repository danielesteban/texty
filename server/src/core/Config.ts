export const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:8080', 'http://localhost:8081'];
export const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1/fms';
export const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8082;
export const sessionSecret = process.env.SESSION_SECRET || 'superunsecuresecret';
