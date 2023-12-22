import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { PublicRoute } from '@app/shared/decorators'
import { ApiFilterQuery } from '@app/shared/decorators/api-filter-query'

import { MonitorService } from './monitor.service'
import { UpdateJobDto } from './dto/crud/update-job.dto'
import { ApiOkResponse, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { CreateJobDto } from './dto/crud/create-job.dto'
import { JobPaginationDto } from './dto/job-pagination.dto'
import { JobQueryViewDto } from './dto/job-query-view.dto'
import { JobFilterViewDto } from './dto/job-filter-view.dto'
import { JobSorterViewDto } from './dto/job-sorter-view.dto'
import { JobEntity } from './entities/job.entity'
import { GetUser } from '@app/shared/decorators/user.decorator'

@ApiTags('monitor')
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'Create one job' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: JobEntity,
  })
  @Post('jobs')
  create(@Body() createJobDto: CreateJobDto) {
    return this.monitorService.create(createJobDto)
  }

  @PublicRoute()
  @ApiOperation({ summary: 'Get all Jobs' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: JobPaginationDto,
  })
  @ApiFilterQuery('filters', JobFilterViewDto)
  @ApiFilterQuery('sortedBy', JobSorterViewDto)
  @Get('jobs')
  findAll(@GetUser() req: Request, @Query() query: JobQueryViewDto) {
    return this.monitorService.findAll(query)
  }

  @PublicRoute()
  @ApiOperation({ summary: 'Get one job' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: JobEntity,
  })
  @Get('jobs/:id')
  findOne(@Param('id') id: string) {
    return this.monitorService.findOne(id)
  }

  @PublicRoute()
  @ApiOperation({ summary: 'Update one job' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: JobEntity,
  })
  @Patch('jobs/:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.monitorService.update(id, updateJobDto)
  }

  @ApiOperation({ summary: 'Remove one job' })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  @Delete('jobs/:id')
  remove(@Param('id') id: string) {
    return this.monitorService.remove(id)
  }
}
