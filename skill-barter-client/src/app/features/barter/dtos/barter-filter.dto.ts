import { BarterUserRole } from '../../../common/enums/barter-user-role.enum';
import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { Barter } from '../../../common/models/barter.model';

export interface BarterFilterDto extends PaginationParams<Barter> {
  barterUserRole?: BarterUserRole;
}
