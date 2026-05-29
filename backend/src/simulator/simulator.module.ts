import { Module } from '@nestjs/common';
import { AlarmsModule } from '../alarms/alarms.module';
import { LogsModule } from '../logs/logs.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';

@Module({
  imports: [AlarmsModule, LogsModule, WebsocketModule],
  controllers: [SimulatorController],
  providers: [SimulatorService],
})
export class SimulatorModule {}
