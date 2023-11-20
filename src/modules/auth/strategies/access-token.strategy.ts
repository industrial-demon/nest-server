import { UserEntity } from '@app/modules/users/entities/user.entity'
import { UsersService } from '@app/modules/users/users.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

type JwtPayload = {
  user: UserEntity
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne({ id: payload.user.id })
    console.log(payload)
    // if (!user) {
    //   throw new UnauthorizedException()
    // }

    return user
  }
}
