import io, { Socket } from 'socket.io-client';

export class Connection {
  public static socket: Socket;

  public static init(): Socket {
    this.socket = io(import.meta.env.VITE_API_ENDPOINT ?? '', { transports: ['websocket'] });

    return this.socket;
  }

  public static basicListen(socket: Socket) {
    socket.on('connect', function () {
      console.log('connected with server');
    });

    socket.on('disconnect', function () {
      console.log('disconnected with server');
    });
  }
}
