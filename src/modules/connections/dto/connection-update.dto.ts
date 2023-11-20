import { ApiProperty } from '@nestjs/swagger'

import { Prisma } from '@prisma/client'
import { IsString } from 'class-validator'

export class ConnectionUpdateDto {
  @ApiProperty({ required: false })
  @IsString()
  [Prisma.ConnectionScalarFieldEnum.name]?: string
}
