import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignupDto implements Partial<User> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}
