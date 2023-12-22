import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { CorsInterceptor } from './cors.interceptor'
import { HttpExceptionFilter } from './http-exception.filter'
import { LoggerMiddleware } from './logger.middleware'

import { PrismaModule } from '@app/modules/prisma/prisma.module'
import { ConnectionsModule } from '@app/modules/connections/connections.module'
import { AuthModule } from '@app/modules/auth/auth.module'
import { UsersModule } from '@app/modules/users/users.module'
import { JwtTokensGuard } from '@app/shared/guards'
import { MonitorModule } from '@app/modules/monitor/monitor.module'
import { config } from '@app/config/config'
import { MulterModule } from '@nestjs/platform-express'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `.env${
        process.env.NODE_ENV?.trim() === 'DEVELOPMENT'
          ? '.development'
          : '.production'
      }`,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule,
    PrismaModule,
    ConnectionsModule,
    AuthModule,
    MonitorModule,
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
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
