import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class MachineGateway {
  @WebSocketServer()
  server!: Server;

  sendMachineUpdate(data: any) {
    this.server.emit('machineUpdated', data);
  }
}
