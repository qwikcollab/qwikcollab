import io, { Socket } from 'socket.io-client';

/*
  Not using useContext for socket, I feel it's opinionated, maybe switch to it later if there are enough reasons
 */
export class Connection {
  private static socket: Socket;

  private constructor() {}

  public static getSocket(): Socket {
    if (!this.socket) {
      console.log('connecting sockets');
      // @ts-ignore
      this.socket = io(import.meta.env.VITE_API_ENDPOINT ?? '', { transports: ['websocket'] });
    }
    return this.socket;
  }
}
