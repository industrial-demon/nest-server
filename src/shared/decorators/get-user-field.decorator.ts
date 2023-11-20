import { createParamDecorator, ExecutionContext } from '@nestjs/common'
export const GetUserField = createParamDecorator(
  (field: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    if (!field) {
      return request.user
    }
    return request.user[field]
  },
)
