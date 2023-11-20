import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req
      ?.get('Authorization')
      ?.replace('Bearer', '')
      ?.trim()

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

    return { ...payload, refreshToken }
  }
}
