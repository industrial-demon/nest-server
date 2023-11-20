import { JwtModuleAsyncOptions } from '@nestjs/jwt'

import { ConfigService } from '@nestjs/config'

export const jwtConfig: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory(config: ConfigService) {
    return {
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '5m' },
    }
  },
}
