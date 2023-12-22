import { Prisma, User } from '@prisma/client'

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { diskStorage } from 'multer'

import { UsersService } from './users.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { GetUserField, PublicRoute } from '@app/shared/decorators'
import { UserViewDto } from './dto/user-view.dto'
import { TransformData } from '@app/shared/interceptors/transform-data.intercepor'

import {
  editFileName,
  imageFileFilter,
} from '@app/shared/utils/file-upload.utils'

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
}

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ type: UserViewDto })
  @Post()
  async createOne(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createOne(createUserDto)
  }

  @PublicRoute()
  @TransformData(UserViewDto)
  // @UseGuards(JwtTokensGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserViewDto,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: any): Promise<UserViewDto[]> {
    const { orderBy, take, direction, skip } = query
    const users = await this.userService.findAll({
      take,
      skip,
      orderBy: {
        [orderBy as string]: direction,
      },
    })
    return users
  }

  @TransformData(UserViewDto)
  @PublicRoute()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserViewDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async findOne(
    @Param() params: Prisma.UserWhereUniqueInput,
  ): Promise<UserViewDto> {
    const user = await this.userService.findOne({
      id: params.id,
    })
    return user
  }

  @ApiOperation({ summary: 'Update one user by id' })
  @Patch(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'data', required: true, type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User update successfully',
    type: UserViewDto,
  })
  async updateOne(
    @Param() { id }: { id: string },
    @Body(ValidationPipe) data: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateOne(id, data)
  }

  @ApiOperation({ summary: 'Delete one user by id' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error',
  })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  async deleteOne(@Param() { id }: { id: string }) {
    return await this.userService.deleteOne(id)
  }

  @ApiOperation({ summary: 'Delete all users' })
  @ApiOkResponse()
  @Delete()
  async deleteAll() {
    return await this.userService.deleteAll()
  }

  // @PublicRoute()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User avatar',
    type: FileUploadDto,
  })
  @ApiOperation({ summary: 'Upload user avatar' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post('upload')
  upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 4000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @GetUserField('id') userId: string,
  ) {
    console.log(userId)
    const response = {}
    // const response = {
    //   originalname: file.originalname,
    //   filename: file.filename,
    // }
    return response
  }
}

