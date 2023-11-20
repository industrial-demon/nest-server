import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util'
import { Post, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { UpdatePostDto } from '../users/dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post
      .create({
        data,
      })
      .catch((error) => {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            new HttpErrorByCode[HttpStatus.BAD_REQUEST]()
          )
        }
      })
  }

  async findAllPosts(params: {
    skip?: number
    take?: number
    cursor?: Prisma.PostWhereUniqueInput
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithRelationInput
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} post`
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`
  }

  remove(id: number) {
    return `This action removes a #${id} post`
  }
}
