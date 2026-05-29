import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebsocketModule } from './websocket/websocket.module';
import { LogsModule } from './logs/logs.module';
import { AlarmsModule } from './alarms/alarms.module';
import { SimulatorModule } from './simulator/simulator.module';

@Module({
  imports: [
    AuthModule,
    MachinesModule,
    PrismaModule,
    WebsocketModule,
    LogsModule,
    AlarmsModule,
    SimulatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
