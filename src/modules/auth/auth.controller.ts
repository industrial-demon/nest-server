import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger'
import { AuthService } from './auth.service'

import { CreateUserDto } from '../users/dto'
import { SignupDto } from './dto'

import { Tokens } from './entities/tokens'
import { JwtRefreshGuard } from '@app/shared/guards'
import { GetUserField, PublicRoute } from '@app/shared/decorators'
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateUserDto) {
    console.log(dto, 'DTO')
    return this.authService.signupLocal(dto)
  }

  @PublicRoute()
  @ApiOkResponse({ type: Tokens })
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: SignupDto) {
    return this.authService.signinLocal(dto)
  }

  @ApiOkResponse()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUserField('id') userId: string) {
    return this.authService.logout(userId)
  }

  @PublicRoute()
  @UseGuards(JwtRefreshGuard)
  @ApiOkResponse({
    type: Tokens,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <referesh token>',
    example: 'Bearer <referesh token>',
    required: true,
  })
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetUserField('id') userId: string,
    @GetUserField('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
