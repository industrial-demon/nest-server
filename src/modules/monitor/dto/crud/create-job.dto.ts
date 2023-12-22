import { Optional } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { $Enums, Job } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateJobDto
  implements
    Pick<
      Job,
      | 'mappingTaskName'
      | 'jobTaskName'
      | 'username'
      | 'userId'
      | 'etlexecStatus'
      | 'status'
    >
{
  @IsString()
  @IsNotEmpty()
  mappingTaskName: string

  @IsString()
  @IsNotEmpty()
  jobTaskName: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiHideProperty()
  @IsNotEmpty()
  @IsEnum($Enums.EtlexecStatus)
  etlexecStatus: $Enums.EtlexecStatus = 'QUEUED'

  @ApiHideProperty()
  @IsNotEmpty()
  @IsEnum($Enums.JobStatus)
  status: $Enums.JobStatus = 'ACTIVE'
}
