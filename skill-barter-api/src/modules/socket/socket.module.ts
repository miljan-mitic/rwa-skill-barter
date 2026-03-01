import { Module } from '@nestjs/common';
import { NotificationSocketGateway } from '././gateways/notification-socket.gateway';
import { CallSocketGateway } from './gateways/call-socket.gateway';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [WsJwtGuard, NotificationSocketGateway, CallSocketGateway],
  exports: [NotificationSocketGateway],
})
export class SocketModule {}
