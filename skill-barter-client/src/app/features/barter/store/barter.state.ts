import { EntityState } from '@ngrx/entity';
import { Barter } from '../../../common/models/barter.model';
import { BarterFilterDto } from '../dtos/barter-filter.dto';

export interface BarterState extends EntityState<Barter> {
  length: number;
  loading: boolean;
  filter: BarterFilter;
}

export interface BarterFilter extends BarterFilterDto {}

export interface UpdateBarter {
  id: number;
  changes: Partial<Barter>;
}
