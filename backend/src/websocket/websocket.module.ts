import { Module } from '@nestjs/common';
import { MachineGateway } from './machine.gateway';

@Module({
  providers: [MachineGateway],
  exports: [MachineGateway],
})
export class WebsocketModule {}
