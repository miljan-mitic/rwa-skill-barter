import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DOCKER_DB_HOST'),
      port: this.configService.get<number>('DOCKER_DB_PORT'),
      database: this.configService.get<string>('DOCKER_DB_NAME'),
      username: this.configService.get<string>('DOCKER_DB_USERNAME'),
      password: this.configService.get<string>('DOCKER_DB_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: false,
    };
  }
}
