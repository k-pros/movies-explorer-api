const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const LIMITER_OPTIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
};

const CORS_OPTIONS = {
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = {
  PORT,
  DB_URL,
  LIMITER_OPTIONS,
  CORS_OPTIONS,
};
