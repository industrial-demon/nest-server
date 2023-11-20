import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from '../users/dto/create-post.dto'
import { UpdatePostDto } from '../users/dto/update-post.dto'
import { Post as PostModel, Prisma } from '@prisma/client'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() data: Prisma.PostCreateInput) {
    return this.postsService.createPost(data)
  }

  @Get()
  findAllPosts() {
    return this.postsService.findAllPosts({})
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postsService.findAllPosts({
      where: { published: true },
    })
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string
  ): Promise<PostModel[]> {
    return this.postsService.findAllPosts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
        ],
      },
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }
}
