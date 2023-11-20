import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { CorsInterceptor } from './cors.interceptor'
import { HttpExceptionFilter } from './http-exception.filter'
import { LoggerMiddleware } from './logger.middleware'

import { PrismaModule } from '../modules/prisma/prisma.module'
import { ConnectionsModule } from '../modules/connections/connections.module'
import { AuthModule } from '@app/modules/auth/auth.module'
import { UsersModule } from '@app/modules/users/users.module'
import { JwtTokensGuard } from '@app/shared/guards'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'client'),
      exclude: ['/api/(.*)'],
    }),
    UsersModule,
    PrismaModule,
    ConnectionsModule,
    AuthModule,
    // PostsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CorsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtTokensGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
