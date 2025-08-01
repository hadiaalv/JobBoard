import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: any): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        throw new WsException('Token not provided');
      }

      const payload = this.jwtService.verify(token);
      client.handshake.auth.userId = payload.sub;
      client.handshake.auth.user = payload;
      
      return true;
    } catch (err) {
      throw new WsException('Invalid token');
    }
  }
} 