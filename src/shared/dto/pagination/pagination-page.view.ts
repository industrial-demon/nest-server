import { ApiProperty } from '@nestjs/swagger'

class Meta {
  @ApiProperty()
  total: number

  @ApiProperty()
  lastPage: number

  @ApiProperty()
  currentPage: number

  @ApiProperty()
  perPage: number

  @ApiProperty({ required: false, nullable: true })
  prev: number | null

  @ApiProperty({ required: false, nullable: true })
  next: number | null
}

export class PaginationPageView<T> {
  readonly result: T[]
  @ApiProperty({ type: Meta })
  readonly meta: Meta
}
