import { ApiProperty } from '@nestjs/swagger'

import { FilterViewDto } from './filters-view.dto'
import { IsNumber, IsOptional, ValidateNested} from 'class-validator'
import { Transform } from 'class-transformer'
import { SortingViewDto } from './sorting-view.dto'

export class QueryConnectionsDto {
  @ApiProperty({
    required: false,
    type: FilterViewDto,
  })
  @IsOptional()
  @ValidateNested({ each: true, always: true, context: QueryConnectionsDto })
  public filters?: FilterViewDto

  @ApiProperty({
    required: false,
    type: SortingViewDto,
  })
  @IsOptional()
  @ValidateNested({ each: true, always: true, context: QueryConnectionsDto })
  public sortedBy?: SortingViewDto

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
