import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigurationService } from 'src/modules/configuration/services/configuration.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configurationService: ConfigurationService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configurationService.get('DOCKER_DB_HOST'),
      port: this.configurationService.get('DOCKER_DB_PORT'),
      database: this.configurationService.get('DOCKER_DB_NAME'),
      username: this.configurationService.get('DOCKER_DB_USERNAME'),
      password: this.configurationService.get('DOCKER_DB_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: true,
    };
  }
}
