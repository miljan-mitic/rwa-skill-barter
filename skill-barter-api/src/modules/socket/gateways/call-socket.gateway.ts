import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { SOCKET_NAMESPACES } from 'src/common/enums/socket-namespaces.enum';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: { origin: process.env.CLIENT_APP_URL },
  namespace: SOCKET_NAMESPACES.CALL,
  transports: ['websocket'],
})
export class CallSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(CallSocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtGuard: WsJwtGuard) {}

  async handleConnection(socket: AuthenticatedSocket) {
    const valid = await this.jwtGuard.verify(socket);
    if (!valid) {
      this.logger.warn(`Unauthorized call connection`);
      socket.disconnect();
      return;
    }

    this.logger.log(`User connected to call: ${socket.userId}`);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.logger.log(`User disconnected from call: ${socket.userId}`);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: any,
  ) {
    socket.broadcast.emit('message', { ...payload, from: socket.userId });
  }

  // @SubscribeMessage('send-message')
  // handleMessage(client: Socket, payload: any) {
  //   console.log(`Client is connected: ${client.id}`, { payload });
  //   client.broadcast.emit('message', payload);
  // }
}
