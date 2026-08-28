/**
 * Reads a required environment variable, failing fast at boot if it is absent.
 *
 * Silent fallbacks are worse than a crash here: an API that boots with a
 * publicly-known JWT secret looks healthy while signing forgeable tokens.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

export default () => ({
  port: parseInt(process.env.API_PORT || '3001', 10),
  database: {
    url: required('DATABASE_URL'),
  },
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: required('JWT_REFRESH_SECRET'),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cloudflare: {
    accountId: process.env.CF_ACCOUNT_ID,
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
    bucketName: process.env.CF_BUCKET_NAME || 'rvios-media',
    publicUrl: process.env.CF_PUBLIC_URL,
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },
});
