interface TokensConfigProps {
  accessTokenSecret: string
  refreshTokenSecret: string
}

interface PostgresConfigProps {
  user: string
  password: string
  host: string
  port: string
  dbname: string
  connectionString: string
}

interface AppConfigProps {
  port: number
}

export interface ConfigProps {
  app: AppConfigProps
  postgres: PostgresConfigProps
  tokens: TokensConfigProps
}
