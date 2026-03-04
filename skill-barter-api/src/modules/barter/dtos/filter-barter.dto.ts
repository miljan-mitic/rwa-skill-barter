import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { createPaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { BARTER_USER_ROLE } from 'src/common/enums/barter-user-role.enum';
import { Barter } from 'src/entities/barter.entity';

export class FilterBarterDto extends createPaginationParamsDto(Barter) {
  @IsOptional()
  @IsNotEmpty({ message: 'BARTER_USER_ROLE_EMPTY' })
  @IsEnum(BARTER_USER_ROLE, { message: 'BARTER_USER_ROLE_WRONG_TYPE' })
  @Expose()
  barterUserRole?: BARTER_USER_ROLE;
}
