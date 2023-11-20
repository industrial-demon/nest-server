import { INestApplication, Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  OpenAPIObject,
} from '@nestjs/swagger'
import { ConnectionsModule } from './modules/connections/connections.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'

import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const globalPrefix = 'api'
  const port = process.env.PORT || 8080
  const app = await NestFactory.create(AppModule)
  const configService: ConfigService = app.get(ConfigService)
  app.enableCors()
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // const reflector = new Reflector()
  // app.useGlobalGuards(new JwtTokensGuard(reflector))

  setupOpenApi(app)
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  )
}
bootstrap()

function setupOpenApi(app: INestApplication) {
  const connectorsConfig = new DocumentBuilder()
    .setTitle('Connectors')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('connections', 'connectors')
    .addBearerAuth()
    .build()

  const usersConfig = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .build()

  const authConfig = new DocumentBuilder()
    .setTitle('Auth')
    .setDescription('Authenficate user')
    .setVersion('1.0')
    .addTag('auth')
    .build()

  new DocumentFactory(app).createDocs([
    {
      path: 'api/auth-docs',
      config: authConfig,
      module: [AuthModule],
    },
    {
      path: 'api/connectors-docs',
      config: connectorsConfig,
      module: [ConnectionsModule],
    },
    {
      path: 'api/users-docs',
      config: usersConfig,
      module: [UsersModule],
    },
  ])
}

class DocumentFactory {
  constructor(private readonly app: INestApplication) {}

  async createDocs(
    docs: Array<{
      config: Omit<OpenAPIObject, 'paths'>
      module: SwaggerDocumentOptions['include']
      path: string
    }>,
  ) {
    docs.forEach(doc => {
      const document = SwaggerModule.createDocument(this.app, doc.config, {
        include: doc.module,
      })
      SwaggerModule.setup(doc.path, this.app, document)
    })
  }
}
