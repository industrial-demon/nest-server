import { User, $Enums } from '@prisma/client'

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  MinLength,
} from 'class-validator'

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
  @IsEnum($Enums.UserStatus)
  @IsUppercase()
  status?: $Enums.UserStatus

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsUppercase()
  roles?: $Enums.UserRole[]

  @MinLength(6)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string
}
