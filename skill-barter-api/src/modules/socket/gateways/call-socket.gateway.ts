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
import { type CallPayload } from 'src/common/types/call-payload.type';
import { SOCKET_EVENT_TYPE } from 'src/common/enums/socket-event-type.enum';

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

  @SubscribeMessage(SOCKET_EVENT_TYPE.JOIN_CALL)
  handleJoinCall(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() callId: string,
  ) {
    socket.join(`call-${callId}`);
    this.logger.log(`User ${socket.userId} joined room call-${callId}`);
  }

  @SubscribeMessage(SOCKET_EVENT_TYPE.SEND_CALL)
  handleSendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: CallPayload,
  ) {
    const callRoom = `call-${payload.callId}`;
    socket.to(callRoom).emit(SOCKET_EVENT_TYPE.RECEIVE_CALL, {
      ...payload,
      from: socket.userId,
    });
  }
}
