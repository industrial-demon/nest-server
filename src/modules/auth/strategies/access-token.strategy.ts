
import { UserViewDto } from '@app/modules/users/dto/user-view.dto'
import { UsersService } from '@app/modules/users/users.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

type JwtPayload = {
  user: UserViewDto
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
      secretOrKey: configService.get('tokens.accessTokenSecret'),
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
