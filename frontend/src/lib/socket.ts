import { io, Socket } from 'socket.io-client';

// Simple function to get cookie value
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;

  connect(token?: string) {
    // Only run on client side
    if (typeof window === 'undefined') {
      return null;
    }

    if (this.socket?.connected || this.isConnecting) {
      return this.socket;
    }

    this.isConnecting = true;
    const authToken = token || getCookie('auth-token');

    if (!authToken) {
      this.isConnecting = false;
      return null;
    }

    try {
      if (typeof io === 'undefined') {
        console.error('Socket.io-client not available');
        this.isConnecting = false;
        return null;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
      const socketUrl = apiUrl.replace('/api', '');

      this.socket = io(socketUrl, {
        auth: {
          token: authToken,
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });
    } catch (error) {
      console.error('Error creating socket connection:', error);
      this.isConnecting = false;
      return null;
    }

    if (this.socket) {
      this.socket.on('connect', () => {
        this.isConnecting = false;
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnecting = false;
        // Retry connection after a delay
        setTimeout(() => {
          if (!this.socket?.connected) {
            this.connect(token);
          }
        }, 5000);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // Add authentication success/failure listeners
      this.socket.on('authenticated', () => {
        // Authentication successful
      });

      this.socket.on('unauthorized', (error) => {
        console.error('Socket authentication failed:', error);
      });

      // Add reconnection listeners
      this.socket.on('reconnect', (attemptNumber) => {
        // Reconnected successfully
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        // Reconnection attempt
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed after all attempts');
      });
    }

    return this.socket;
  }

  disconnect() {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    if (typeof window === 'undefined') return null;
    return this.socket;
  }

  isConnected(): boolean {
    if (typeof window === 'undefined') return false;
    return this.socket?.connected || false;
  }

  // Join a room
  joinRoom(room: string) {
    if (typeof window === 'undefined') return;
    if (this.socket?.connected) {
      this.socket.emit('join_room', room);
    }
  }

  // Leave a room
  leaveRoom(room: string) {
    if (typeof window === 'undefined') return;
    if (this.socket?.connected) {
      this.socket.emit('leave_room', room);
    }
  }

  // Listen to events
  on(event: string, callback: (data: any) => void) {
    if (typeof window === 'undefined') return;
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove event listener
  off(event: string, callback?: (data: any) => void) {
    if (typeof window === 'undefined') return;
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

export const socketService = new SocketService();
export default socketService; 