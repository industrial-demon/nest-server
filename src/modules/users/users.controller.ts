import { Prisma, User } from '@prisma/client'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'

import { UsersService } from './users.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UserEntity } from './entities/user.entity'
import { JwtTokensGuard } from '@app/shared/guards'
import { PublicRoute } from '@app/shared/decorators'

// @ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ type: UserEntity })
  @Post()
  async createOne(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createOne(createUserDto)
  }

  @PublicRoute()
  @UseGuards(JwtTokensGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserEntity,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: any) {
    const { orderBy, take, direction, skip } = query
    return await this.userService.findAll({
      take,
      skip,
      orderBy: {
        [orderBy as string]: direction,
      },
    })
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserEntity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async findOne(@Param() params: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.userService.findOne({
      id: params.id,
    })
  }

  @ApiOperation({ summary: 'Update one user by id' })
  @Patch(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'data', required: true, type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User update successfully',
    type: UserEntity,
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
}
