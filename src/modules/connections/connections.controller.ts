import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiExtraModels,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger'

import { ApiFilterQuery } from '../../shared/decorators/api-filter-query'
import { ConnectionsService } from './connections.service'

import {
  ConnectionCreateDto,
  ConnectionUpdateDto,
  FilterViewDto,
  PaginationDto,
  QueryConnectionsDto,
  SortingViewDto,
} from './dto'
import { PublicRoute } from '@app/shared/decorators'
import { RequestConverterPipe } from './pipes/create-connection.pipe'

@Controller('connections')
@ApiTags('connections')
export class ConnectionsController {
  constructor(private readonly connectionService: ConnectionsService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'Get all connections' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: PaginationDto,
  })
  @ApiExtraModels(FilterViewDto)
  @ApiFilterQuery('filters', FilterViewDto)
  @ApiFilterQuery('sortedBy', SortingViewDto)
  async findAll(@Query() query: QueryConnectionsDto) {
    const { sortedBy, filters, page, perPage } = query
    return await this.connectionService.findAll({
      sortedBy,
      filters,
      page,
      perPage,
    })
  }

  @Put(':id')
  async replaceOne(@Param('id') id: string) {}

  @PublicRoute()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update one connection' })
  @ApiOkResponse({ status: HttpStatus.CREATED, description: 'done' })
  @ApiBody({ type: ConnectionUpdateDto })
  async updateOne(
    @Param('id') id: string,
    @Body() updates: ConnectionUpdateDto,
  ) {
    return await this.connectionService.updateOne({ id, data: updates })
  }

  @Post()
  @ApiOperation({ summary: 'Create one connection' })
  @ApiOkResponse({ status: HttpStatus.CREATED, description: 'done' })
  @UsePipes(new RequestConverterPipe())
  async createOne(
    @Body()
    dto: ConnectionCreateDto,
  ) {
    return await this.connectionService.createOne(dto)
  }

  @ApiOperation({ summary: 'Delete one connection' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'delete' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @PublicRoute()
  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.connectionService.removeOne(id)
  }
}
