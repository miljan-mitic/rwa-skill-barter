import { PaginationParams } from '../../../common/interfaces/pagination-params.interface';
import { User } from '../../../common/models/user.model';

export interface UserFilterDto extends PaginationParams<User> {
  ratingAvgMin?: number;
  ratingAvgMax?: number;
  ratingCountMin?: number;
  ratingCountMax?: number;
}
