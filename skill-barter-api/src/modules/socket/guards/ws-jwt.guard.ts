import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigurationService } from 'src/modules/configuration/services/configuration.service';
import { AuthenticatedSocket } from '../gateways/call-socket.gateway';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class WsJwtGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async verify(socket: AuthenticatedSocket): Promise<boolean> {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) return false;

      const secretKey = this.configurationService.get('JWT_ACCESS_SECRET_KEY');
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });
      socket.userId = payload.userId.toString();
      return true;
    } catch {
      return false;
    }
  }
}
