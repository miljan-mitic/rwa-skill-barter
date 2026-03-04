import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './services/typeorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsSortableColumnConstraint } from 'src/common/validators/is-sortable-column.validator';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [TypeOrmConfigService, IsSortableColumnConstraint],
})
export class DatabaseModule {}
