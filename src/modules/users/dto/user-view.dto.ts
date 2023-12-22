import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { User, $Enums } from '@prisma/client'
import { IsAbstractEnum } from '../../../shared/decorators'
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
} from 'class-validator'
import { Exclude } from 'class-transformer'

export class UserViewDto implements User {
  @ApiProperty()
  public id: string

  @ApiProperty()
  public readonly lastName: string

  @ApiProperty()
  readonly createdAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty({
    enum: $Enums.UserStatus,
    example: $Enums.UserStatus,
  })
  @IsOptional()
  @IsString()
  @IsUppercase()
  @IsAbstractEnum($Enums.UserStatus)
  readonly status: $Enums.UserStatus

  @ApiProperty({
    enum: $Enums.UserRole,
    enumName: 'UserRole',
    example: [$Enums.UserRole.USER, $Enums.UserRole.OPERATOR],
    description: `List of all roles, ${$Enums.UserRole.SUPER_ADMIN} - only one`,
    isArray: true,
  })
  @IsArray()
  @IsEnum($Enums.UserRole, { each: true })
  readonly roles: $Enums.UserRole[]

  @IsOptional()
  @IsString()
  public profileImage: string

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  readonly jobDescription: string

  @Exclude()
  @ApiHideProperty()
  password: string

  @Exclude()
  @ApiHideProperty()
  refreshHash: string

  // constructor(partial: Partial<UserViewDto>) {
  //   console.dir(partial, 'FFFFFFFFFFF')
  //   Object.assign(this, partial)
  // }
}
