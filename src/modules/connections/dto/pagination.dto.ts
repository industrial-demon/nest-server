import {
  PaginationMixin,
  PaginationPageView,
} from '../../../shared/dto/pagination'
import { ConnectionEntity } from '../entities/connection.entity'

/**
 * [description]
 */
export class PaginationDto extends PaginationMixin(
  ConnectionEntity,
) {
  /**
   * [description]
   * @param result
   * @param total
   */
  constructor([result, meta]: [
    ConnectionEntity[],
    PaginationPageView<ConnectionEntity>['meta'],
  ]) {
    super()
    Object.assign(this, { result, meta })
  }
}
