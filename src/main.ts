import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import * as hbs from 'express-handlebars'

import { AppModule } from './app/app.module'
import { createOpenApi } from './swagger/create-open-api'

const globalPrefix = 'api'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService: ConfigService = app.get(ConfigService)
  const port = configService.get('app.port')
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
  app.useGlobalInterceptors()
  app.useStaticAssets(join(process.cwd(), './public'))
  app.setBaseViewsDir(join(process.cwd(), './views/layouts'))
  app.engine(
    'hbs',
    hbs({
      extname: 'hbs',
      defaultLayout: 'root',
      layoutsDir: join(process.cwd(), './views/layouts'),
      partialsDir: join(process.cwd(), './views/partials'),
    }),
  )
  app.setViewEngine('hbs')
  // const reflector = new Reflector(
  // app.useGlobalGuards(new JwtTokensGuard(reflector))
  createOpenApi(app)
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  )
}
bootstrap()
