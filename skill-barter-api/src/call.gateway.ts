import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
  namespace: 'call',
})
export class CallGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client is connected: ${client.id}`);
  }

  @SubscribeMessage('send-message')
  handleMessage(client: Socket, payload: any) {
    console.log(`Client is connected: ${client.id}`, { payload });
    client.broadcast.emit('message', payload);
  }
}
