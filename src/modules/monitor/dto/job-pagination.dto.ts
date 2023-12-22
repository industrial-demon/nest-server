import { PaginationMixin, PaginationPageView } from '@app/shared/dto/pagination'
import { JobEntity } from '../entities/job.entity'

export class JobPaginationDto extends PaginationMixin(JobEntity) {
  constructor([result, meta]: [
    JobEntity[],
    PaginationPageView<JobEntity>['meta'],
  ]) {
    super()
    Object.assign(this, { result, meta })
  }
}
