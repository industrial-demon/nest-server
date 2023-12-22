import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    const jwtService = new JwtService()
    const token = request.get('authorization')?.replace('Bearer', '')?.trim()
    const user = jwtService.decode(token)
    return user
  },
)
