import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { AppLoggerMiddleware } from './common/middlewares/log.middleware';
import { FileModule } from './modules/file/file.module';
import { CategoryModule } from './modules/category/category.module';
import { SkillModule } from './modules/skill/skill.module';
import { OfferModule } from './modules/offer/offer.module';
import { OfferRequestModule } from './modules/offer-request/offer-request.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    FileModule,
    CategoryModule,
    SkillModule,
    OfferModule,
    OfferRequestModule,
    TransactionModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
