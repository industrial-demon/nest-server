import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { ConnectionCreateDto } from '../dto'

@Injectable()
export class CreateConnectionPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      value.createdBy = value.username
    }

    return value
  }
}

@Injectable()
export class RequestConverterPipe implements PipeTransform {
  transform(body: any): ConnectionCreateDto {
    const result = new ConnectionCreateDto()
    result.name = body.name
    result.username = body.name
    result.createdBy = body.username
    result.updatedBy = body.username
    result.type = body.type
    return result
  }
}
