import { createPaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { Category } from 'src/entities/category.entity';

export class FilterCategoryDto extends createPaginationParamsDto(Category) {}
