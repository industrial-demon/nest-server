import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  MinLength,
  ValidationOptions,
} from 'class-validator'
import { User, $Enums } from '@prisma/client'
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger'
import { IsAbstractEnum } from '@app/shared/decorators'

export class CreateUserDto implements Partial<User> {
  // @ApiProperty()
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
    enum: $Enums.UserStatus,
  })
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  @IsUppercase()
  @IsAbstractEnum($Enums.UserStatus)
  readonly status: $Enums.UserStatus

  @ApiProperty({
    enum: $Enums.UserStatus,
  })

  // @ApiHideProperty()
  @IsArray()
  @IsEnum($Enums.UserRole, { each: true })
  // @IsUppercase()
  // @IsAbstractEnum($Enums.UserRole, {each: true})
  readonly roles: $Enums.UserRole[]
}
