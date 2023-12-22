import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class JobSorterViewDto
  implements Prisma.ConnectionOrderByWithRelationInput
{
  @ApiProperty({ required: false, enum: Prisma.SortOrder })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  [Prisma.JobScalarFieldEnum.mappingTaskName]?: Prisma.SortOrder;

  @ApiProperty({ required: false, enum: Prisma.SortOrder })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  [Prisma.JobScalarFieldEnum.jobTaskName]?: Prisma.SortOrder

  @ApiProperty({ required: false, enum: Prisma.SortOrder })
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  updateTime?: Prisma.SortOrder
}
