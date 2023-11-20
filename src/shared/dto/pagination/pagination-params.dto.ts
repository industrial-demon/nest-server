import { ApiProperty } from '@nestjs/swagger'
import { Type } from '@nestjs/common'
import { PaginationPageView } from './pagination-page.view';

export function PaginationMixin<Entity>(
  classRef: Type<Entity>,
): any & PaginationPageView<Entity> {

  abstract class Pagination extends PaginationPageView<Entity> {
    @ApiProperty({
      type: classRef,
      isArray: true,
      description: 'Result of the selection by the specified parameters',
    })
    public readonly result: Entity[]
  }

  return Pagination
}
