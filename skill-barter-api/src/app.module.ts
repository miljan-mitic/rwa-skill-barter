import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { AppLoggerMiddleware } from './common/middlewares/log.middleware';

@Module({
  imports: [ConfigurationModule, DatabaseModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
