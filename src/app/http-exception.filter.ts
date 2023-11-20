import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )
    const updates = {}

    const exceptionResponseObj = exception.getResponse()

    if (typeof exceptionResponseObj === 'object') {
      Object.assign(updates, exceptionResponseObj)
    }

    if (typeof exceptionResponseObj === 'string') {
      Object.assign(updates, {
        message: exception.message,
        statusCode: exception.getStatus(),
      })
    }

    response.status(exception.getStatus()).json({
      ...updates,
      path: request.url,
      timestamp: new Date().toISOString(),
    })
  }
}
