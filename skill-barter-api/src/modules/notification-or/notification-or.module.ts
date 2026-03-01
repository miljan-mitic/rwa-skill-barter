import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationOR } from 'src/entities/notification-or.entity';
import { NotificationORService } from './services/notification-or.service';
import { OfferRequestModule } from '../offer-request/offer-request.module';
import { NotificationORController } from './controllers/notification-or.controller';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationOR]),
    forwardRef(() => OfferRequestModule),
    SocketModule,
  ],
  providers: [NotificationORService],
  controllers: [NotificationORController],
  exports: [NotificationORService],
})
export class NotificationORModule {}
