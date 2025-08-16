require('dotenv').config();

const required = (key) => {
  if (!process.env[key]) throw new Error(`Missing env: ${key}`);
  return process.env[key];
};

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  DB: {
    host: required('DB_HOST'),
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_DATABASE')
  },

  JWT: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  EMAIL: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
};

