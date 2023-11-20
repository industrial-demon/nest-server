import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import {
  IsDateString,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ConnectionType } from '../enums/connection-type.enum'

export class FilterViewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  [Prisma.ConnectionScalarFieldEnum.name]?: string;

  @ApiProperty({ required: false, isArray: true, enum: ConnectionType })
  @IsOptional()
  @Transform(({value})=> {
    return value
  })
  @IsArray()
  [Prisma.ConnectionScalarFieldEnum.type]?: Array<ConnectionType>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  [Prisma.ConnectionScalarFieldEnum.database]?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  [Prisma.ConnectionScalarFieldEnum.createTime]?: string
}
