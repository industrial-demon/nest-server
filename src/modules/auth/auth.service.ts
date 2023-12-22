import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import * as argon from 'argon2'
import { CreateUserDto } from '../users/dto'
import { User } from '@prisma/client'
import { Tokens } from './entities/tokens'
import { SignupDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signupLocal(userDto: CreateUserDto) {
    const hashedPassword = await argon.hash(userDto.password)
    userDto.password = hashedPassword
    const user = await this.prisma.user.create({ data: userDto })
    const tokens = await this.getTokens(user)
    await this.updateRefreshToken(user.id, tokens.refresh_token)
    return tokens
  }

  async signinLocal(singinDto: SignupDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: singinDto.email,
      },
    })
    if (!user) {
      throw new NotFoundException(`No user found for email: ${singinDto.email}`)
    }
    const isPasswordValid = await argon.verify(
      user.password,
      singinDto.password,
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }
    const tokens = await this.getTokens(user)
    await this.updateRefreshToken(user.id, tokens.refresh_token)
    return tokens
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshHash: null,
      },
    })
  }

  async refreshTokens(userId: string, refreshToken: Tokens['refresh_token']) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      throw new NotFoundException()
    }

    const matchedTokens = await argon.verify(user.refreshHash, refreshToken)
    if (!matchedTokens) {
      throw new ForbiddenException('Access denied')
    }

    const tokens = await this.getTokens(user)
    await this.updateRefreshToken(user.id, tokens.refresh_token)
    return tokens
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: Tokens['refresh_token'],
  ) {
    const hashedRefreshToken = await argon.hash(refreshToken)
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshHash: hashedRefreshToken,
      },
    })
  }

  async getTokens(user: User): Promise<Tokens> {
    delete user.password
    delete user.refreshHash
    const tokens = this.configService.get('tokens')

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          user,
        },
        {
          secret: tokens.accessTokenSecret,
          expiresIn: 60 * 5,
        },
      ),

      this.jwtService.signAsync(
        {
          id: user.id,
          name: user.name,
        },
        {
          secret: tokens.refreshTokenSecret,
          expiresIn: '2 days',
        },
      ),
    ])
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
}
