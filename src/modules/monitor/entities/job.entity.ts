import { ApiProperty } from '@nestjs/swagger'
import { $Enums, Job } from '@prisma/client'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class JobEntity implements Job {
  @ApiProperty()
  @IsUUID()
  batchid: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mappingTaskName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobTaskName: string

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  startedAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  completedAt: Date

  @ApiProperty()
  etlexecStatus: $Enums.EtlexecStatus = 'QUEUED'

  @ApiProperty({
    enum: [$Enums.JobStatus.ACTIVE, $Enums.JobStatus.ARCHIVED],
  })
  status: $Enums.JobStatus

  @ApiProperty()
  deleteFlag: boolean = false
}
