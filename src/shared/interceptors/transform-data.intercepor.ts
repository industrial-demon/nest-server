import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common'
import { map } from 'rxjs'
import { ClassConstructor, plainToInstance } from 'class-transformer'

export function TransformData(dto: ClassConstructor<unknown>) {
  console.log(dto, "DTO")
  return UseInterceptors(new TransformDataInterceptor(dto))
}

@Injectable()
export class TransformDataInterceptor implements NestInterceptor {
  constructor(private readonly classToUse: ClassConstructor<unknown>) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => {
        return plainToInstance(this.classToUse, data)
      }),
    )
  }
}
