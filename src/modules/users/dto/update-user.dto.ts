import { User } from '@prisma/client'

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  MinLength,
} from 'class-validator'

import { STATUS } from '../enums'
import { IsStringType } from '@app/shared/decorators/string-type-decorator'
export class UpdateUserDto implements Partial<User> {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsStringType()
  name?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(STATUS)
  @IsUppercase()
  status?: STATUS

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsUppercase()
  role?: User['role']

  @MinLength(6)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string
}
