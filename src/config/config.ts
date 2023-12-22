import { ConfigProps } from './config.interface'

export const config = (): ConfigProps => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  tokens: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
  postgres: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dbname: process.env.POSTGRES_DB,
    connectionString: process.env.DATABASE_URL,
  },
})
