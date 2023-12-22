import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateJobDto } from './dto/crud/create-job.dto'
import { UpdateJobDto } from './dto/crud/update-job.dto'
import { PaginateFunction, paginator } from '@app/shared/dto/pagination'
import { JobQueryViewDto } from './dto/job-query-view.dto'
import { Job } from '@prisma/client'

const paginate: PaginateFunction = paginator({})

@Injectable()
export class MonitorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createJobDto: CreateJobDto) {
    try {
      return await this.prisma.job.create({ data: createJobDto })
    } catch (e) {}
  }

  findAll(params?: JobQueryViewDto) {
    try {
      return paginate(
        this.prisma.job,
        {
          where: {
            status: params.filters?.status,
            userId: params.filters?.userId,
            jobTaskName: {
              contains: params.filters?.jobTaskName,
              mode: 'insensitive',
            },
          },

          orderBy: params.sortedBy,
        },
        {
          page: params.page,
          perPage: params.perPage,
        },
      )
    } catch {}
  }

  findOne(id: Job['batchid']) {
    return this.prisma.job.findUnique({
      where: {
        batchid: id,
      },
    })
  }

  update(id: Job['batchid'], updateJobDto: UpdateJobDto) {
    return this.prisma.job.update({
      where: {
        batchid: id,
      },
      data: updateJobDto,
    })
  }

  remove(id: Job['batchid']) {
    return this.prisma.job.delete({
      where: {
        batchid: id,
      },
    })
  }
}
