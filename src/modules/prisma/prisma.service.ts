import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(readonly configeService: ConfigService) {
    const postresConfig = configeService.get('postgres')
    console.log(process.env.NODE_ENV, 'ENV')
    const datasourceUrl =
      process.env.NODE_ENV?.trim() === 'DEVELOPMENT'
        ? `postgres://${postresConfig.user}:${postresConfig.password}@${postresConfig.host}:${postresConfig.port}/${postresConfig.dbname}?schema=public`
        : postresConfig.connectionString

    super({
      datasourceUrl,
    })
  }
}
