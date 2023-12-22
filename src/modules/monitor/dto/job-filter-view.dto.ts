import { IsAbstractEnum } from '@app/shared/decorators'
import { ApiProperty } from '@nestjs/swagger'
import { Prisma, $Enums } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'

export class JobFilterViewDto {
  @ApiProperty({
    required: false,
    enum: $Enums.JobStatus,
  })
  @IsOptional()
  @IsString()
  @IsAbstractEnum($Enums.JobStatus)
  [Prisma.JobScalarFieldEnum.status]?: $Enums.JobStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  [Prisma.JobScalarFieldEnum.userId]?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  [Prisma.JobScalarFieldEnum.jobTaskName]?: string
}
