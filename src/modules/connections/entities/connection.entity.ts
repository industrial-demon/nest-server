import { ApiProperty } from '@nestjs/swagger'
import { Connection } from '@prisma/client'
import { IsUUID } from 'class-validator'
import { ConnectionType } from '../enums/connection-type.enum'
export class ConnectionEntity implements Connection {
  @ApiProperty()
  @IsUUID()
  id: string

  @ApiProperty()
  orgId: string
  @ApiProperty()
  name: string
  @ApiProperty({ enum: ConnectionType })
  type: ConnectionType
  @ApiProperty()
  description: string
  @ApiProperty()
  agentId: string
  @ApiProperty()
  runtimeEnvironmentId: string
  @ApiProperty()
  instanceDisplayName: string
  @ApiProperty()
  host: string
  @ApiProperty()
  database: string
  @ApiProperty()
  codepage: string
  @ApiProperty()
  adjustedJdbcHostName: string
  @ApiProperty()
  shortDescription: string
  @ApiProperty()
  port: string
  @ApiProperty()
  username: string
  @ApiProperty()
  password: string
  @ApiProperty()
  createTime: Date
  @ApiProperty()
  updateTime: Date
  @ApiProperty()
  createdBy: string
  @ApiProperty()
  updatedBy: string
}
