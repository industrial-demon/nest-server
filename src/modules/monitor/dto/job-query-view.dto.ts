import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { Transform } from 'class-transformer'

import { JobFilterViewDto } from './job-filter-view.dto'
import { JobSorterViewDto } from './job-sorter-view.dto'

export class JobQueryViewDto {
  @ApiProperty({
    required: false,
    type: JobFilterViewDto,
  })
  @IsOptional()
  @ValidateNested({ each: true, always: true, context: JobQueryViewDto })
  public filters?: JobFilterViewDto

  @ApiProperty({
    required: false,
    type: JobSorterViewDto,
  })
  @IsOptional()
  @ValidateNested({ each: true, always: true, context: JobQueryViewDto })
  public sortedBy?: JobSorterViewDto

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  public page?: number

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  public perPage?: number
}
