import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Connection } from '@prisma/client'
import {
  PaginateFunction,
  PaginationPageView,
  paginator,
} from '../../shared/dto/pagination'
import { PrismaService } from '../prisma/prisma.service'
import { FilterViewDto } from './dto/filters-view.dto'
import { ConnectionCreateDto, ConnectionUpdateDto, SortingViewDto } from './dto'

const paginate: PaginateFunction = paginator({})

@Injectable()
export class ConnectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(dto: ConnectionCreateDto) {
    return await this.prisma.connection.create({
      data: dto,
    })
  }
  async findAll(params?: {
    filters?: FilterViewDto
    sortedBy?: SortingViewDto
    page?: number
    perPage?: number
  }): Promise<PaginationPageView<Connection>> {
    const {
      filters,
      sortedBy = { createTime: 'desc' },
      page,
      perPage = 10,
    } = params
    return paginate(
      this.prisma.connection,
      {
        where: {
          name: {
            contains: filters?.name,
          },
          type: {
            in: filters?.type,
          },
          database: filters?.database,
          createTime: {
            gte: filters?.createTime,
          },
        },
        orderBy: sortedBy,
      },
      {
        perPage: perPage,
        page,
      },
    )
  }

  async updateOne(params: {
    id: string
    data: ConnectionUpdateDto
  }): Promise<Connection> {
    const { id, data } = params
    const existConnection = await this.prisma.connection.findUnique({
      where: {
        id: id,
      },
    })

    if (!existConnection) {
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND)
    }

    return await this.prisma.connection.update({
      where: {
        id,
      },
      data,
    })
  }

  async removeOne(id: string) {
    await this.prisma.connection.delete({
      where: {
        id: id,
      },
    })
  }
}
