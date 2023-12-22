import { PublicRoute } from '@app/shared/decorators'
import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller()
export class AppController {
  @PublicRoute()
  @Get()
  root(@Res() res: Response) {
    return res.render('root', {
      partials: 'main',
      message: 'Online',
    })
  }
}
