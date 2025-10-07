import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './services/typeorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [TypeOrmConfigService],
})
export class DatabaseModule {}
