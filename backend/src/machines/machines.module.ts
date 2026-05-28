import { Module } from '@nestjs/common';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { LogsModule } from 'src/logs/logs.module';
import { AlarmsModule } from 'src/alarms/alarms.module';

@Module({
  imports: [WebsocketModule, LogsModule, AlarmsModule],
  controllers: [MachinesController],
  providers: [MachinesService],
})
export class MachinesModule {}
