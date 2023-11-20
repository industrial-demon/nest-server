import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class SortingViewDto
  implements Prisma.ConnectionOrderByWithRelationInput
{
  @ApiProperty({ required: false, enum: Prisma.SortOrder })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  name?: Prisma.SortOrder

  @ApiProperty({ required: false, enum: Prisma.SortOrder })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  type?: Prisma.SortOrder

  @ApiProperty({ required: false, enum: Prisma.SortOrder })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  createTime?: Prisma.SortOrder
}
