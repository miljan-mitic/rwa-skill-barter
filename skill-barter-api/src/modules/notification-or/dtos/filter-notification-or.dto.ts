import { createPaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { NotificationOR } from 'src/entities/notification-or.entity';

export class FilterNotificationORDto extends createPaginationParamsDto(
  NotificationOR,
) {}
