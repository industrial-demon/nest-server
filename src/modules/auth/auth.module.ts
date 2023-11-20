import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from '../users/users.module'
import { PrismaModule } from '../prisma/prisma.module'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'
@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
