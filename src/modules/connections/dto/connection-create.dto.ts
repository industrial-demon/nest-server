import { ApiProperty } from '@nestjs/swagger'

import { Connection, Prisma } from '@prisma/client'
import { IsDate, IsEmpty, IsEnum, IsString, ValidateIf } from 'class-validator'
import { faker } from '@faker-js/faker'
import { ConnectionType } from '../enums/connection-type.enum'
import { Transform } from 'class-transformer'
import { Optional } from '@nestjs/common'

export class ConnectionCreateDto implements Omit<Connection, 'id'> {
  @Transform(ctx => {
    ctx.obj.createdBy = ctx.value
    return ctx.value
  })
  @ApiProperty({ required: true })
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  [Prisma.ConnectionScalarFieldEnum.name]: string

  @ApiProperty({ required: false })
  @IsString()
  orgId: string = faker.string.uuid()

  @ApiProperty({ required: false })
  @IsString()
  @IsEnum(ConnectionType)
  type: ConnectionType

  @ApiProperty({ required: false })
  @IsString()
  description: string = faker.lorem.text()

  @ApiProperty({ required: false })
  @IsString()
  agentId: string = faker.string.uuid()

  @ApiProperty({ required: false })
  @IsString()
  runtimeEnvironmentId: string = faker.string.uuid()

  @ApiProperty()
  @IsString()
  instanceDisplayName: string = ConnectionType.FTP

  @ApiProperty()
  @IsString()
  host: string = 'localhost:4545'

  @ApiProperty()
  @IsString()
  port: string = '4545'

  @ApiProperty()
  @IsString()
  database: string = 'sqlite'
  @ApiProperty()
  @IsString()
  codepage: string = '224'
  @IsString()
  adjustedJdbcHostName: string = 'Some'
  @IsString()
  shortDescription: string = faker.lorem.word()

  @IsString()
  password: string = '********'

  @IsDate()
  createTime: Date = new Date()
  @IsDate()
  updateTime: Date = new Date()

  @Transform(o => {
    console.log(o)
  })
  @ValidateIf(o => Boolean(o.username))
  @ApiProperty({ required: false })
  @IsString()
  createdBy: string

  @ApiProperty({ required: false })
  @ValidateIf(o => Boolean(o.username))
  @IsEmpty()
  @Optional()
  updatedBy: string
}
