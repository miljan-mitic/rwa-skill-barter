import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { AuthenticatedSocket } from './call-socket.gateway';
import { SOCKET_EVENT_TYPE } from 'src/common/enums/socket-event-type.enum';
import { SOCKET_NAMESPACES } from 'src/common/enums/socket-namespaces.enum';

@WebSocketGateway({
  cors: { origin: process.env.CLIENT_APP_URL },
  namespace: SOCKET_NAMESPACES.NOTIFICATION_OR,
  transports: ['websocket'],
})
export class NotificationSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(NotificationSocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtGuard: WsJwtGuard) {
    this.logger.log('NOTIFICATION GATEWAY INSTANCE CREATED');
  }

  async handleConnection(socket: AuthenticatedSocket) {
    const valid = await this.jwtGuard.verify(socket);
    if (!valid) {
      this.logger.warn(`Unauthorized connection attempt`);
      socket.disconnect();
      return;
    }

    socket.join(socket.userId);
    this.logger.log(`User connected to notification: ${socket.userId}`);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.logger.log(`User disconnected from notificaton: ${socket.userId}`);
  }

  sendNotification<T>(
    userId: string,
    eventType: SOCKET_EVENT_TYPE,
    notification: T,
  ) {
    this.server.to(userId).emit(eventType, notification);
  }
}
