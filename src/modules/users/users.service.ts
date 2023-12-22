import {
  BadRequestException,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util'

import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto'
import * as argon from 'argon2'
import { UserViewDto } from './dto/user-view.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await argon.hash(userDto.password)

    try {
      const user = await this.prisma.user.create({
        data: { ...userDto, password: hashedPassword },
      })

      return user
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException(
            {
              message:
                'There is a unique constraint violation, a new user cannot be created with this email',
            },
            HttpStatus.CONFLICT,
          )
        }
      }
      return err
    }
  }

  async findAll(params?: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<UserViewDto[]> {
    const { skip, take = 10, cursor, where, orderBy } = params

    try {
      return await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        // select: {
        //   id: true,
        //   name: true,
        //   roles: true,
        //   email: true,
        // },
      })
    } catch (err) {
      throw new HttpException(
        {
          message: `Error DB ${process.env.DATABASE_URL}`,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserViewDto> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
    if (!user) {
      throw new NotFoundException({
        error: {
          message: 'User Not Found',
          status: HttpStatus.NOT_FOUND,
        },
      })
    }
    return user
  }

  async updateOne(
    id: Prisma.UserWhereUniqueInput['id'],
    userUpdates: Prisma.UserUpdateInput,
  ) {
    if (userUpdates.password && typeof userUpdates.password === 'string') {
      const hashedPassword = await argon.hash(userUpdates.password)
      userUpdates.password = hashedPassword
    }

    return await this.prisma.user
      .update({
        where: {
          id: id,
        },
        data: userUpdates,
      })
      .catch(error => {
        throw new BadRequestException(
          new HttpErrorByCode[HttpStatus.BAD_REQUEST](error),
        )
      })
  }

  async deleteOne(userId: Prisma.UserWhereUniqueInput['id']) {
    await this.findOne({ id: userId })

    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    })
  }

  async deleteAll() {
    return await this.prisma.user.deleteMany()
  }
}
