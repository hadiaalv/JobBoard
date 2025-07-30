import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();

  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.log('WebSocket: No token provided, disconnecting client');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      if (userId) {
        client.handshake.auth.userId = userId;
        client.handshake.auth.user = payload;
        this.connectedUsers.set(userId, client);
        client.join(`user_${userId}`);
        console.log(`WebSocket: User ${userId} connected successfully`);
      } else {
        console.log('WebSocket: No userId in token payload, disconnecting client');
        client.disconnect();
      }
    } catch (error) {
      console.error('WebSocket authentication failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`WebSocket: User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join_room')
  @UseGuards(WsJwtGuard)
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.join(room);
    return { event: 'joined_room', room };
  }

  @SubscribeMessage('leave_room')
  @UseGuards(WsJwtGuard)
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.leave(room);
    return { event: 'left_room', room };
  }

  sendToUser(userId: string, event: string, data: any) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit(event, data);
    }
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  sendToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  sendJobUpdate(jobId: string, data: any) {
    this.sendToRoom(`job_${jobId}`, 'job_updated', data);
  }

  sendNewJob(data: any) {
    this.sendToAll('new_job', data);
  }

  sendApplicationUpdate(userId: string, data: any) {
    this.sendToUser(userId, 'application_updated', data);
  }

  sendNewApplication(employerId: string, data: any) {
    this.sendToUser(employerId, 'new_application', data);
  }
} 