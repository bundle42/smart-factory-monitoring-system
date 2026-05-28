import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { PrismaModule } from './prisma/prisma.module';
import { MachineGateway } from './websocket/machine.gateway';
import { WebsocketModule } from './websocket/websocket.module';
import { LogsModule } from './logs/logs.module';
import { AlarmsModule } from './alarms/alarms.module';

@Module({
  imports: [AuthModule, MachinesModule, PrismaModule, WebsocketModule, LogsModule, AlarmsModule],
  controllers: [AppController],
  providers: [AppService, MachineGateway],
})
export class AppModule {}
