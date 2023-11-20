import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  MinLength,
} from 'class-validator'
import { User } from '@prisma/client'
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger'
import { ROLE, STATUS } from '../enums'
import { IsAbstractEnum } from '../../../shared/decorators'
export class CreateUserDto implements Partial<User> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsString()
  password: string

  @ApiProperty({
    enum: STATUS,
  })
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  @IsUppercase()
  @IsAbstractEnum(STATUS)
  readonly status: STATUS = STATUS.ACTIVATED

  @ApiHideProperty()
  @IsString()
  @IsUppercase()
  @IsAbstractEnum(ROLE)
  readonly role: ROLE = ROLE.ADMIN
}
