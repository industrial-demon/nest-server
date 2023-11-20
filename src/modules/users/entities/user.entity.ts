import { Optional } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { IsAbstractEnum } from '../../../shared/decorators'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
} from 'class-validator'
import { ROLE, STATUS } from '../enums'

export class UserEntity implements Omit<User, 'refreshHash'> {
  @Optional()
  @ApiPropertyOptional()
  id: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly password: string

  @ApiProperty({
    enum: STATUS,
  })
  @IsOptional()
  @IsString()
  @IsUppercase()
  @IsAbstractEnum(STATUS)
  readonly status: STATUS

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUppercase()
  @IsAbstractEnum(ROLE)
  readonly role: ROLE
}
