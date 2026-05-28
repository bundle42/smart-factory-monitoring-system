import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachineGateway } from 'src/websocket/machine.gateway';
import { LogsService } from 'src/logs/logs.service';
import { AlarmsService } from 'src/alarms/alarms.service';

@Injectable()
export class MachinesService {
  constructor(
    private prisma: PrismaService,
    private gateway: MachineGateway,
    private logsService: LogsService,
    private alarmsService: AlarmsService,
  ) {}

  async create(dto: CreateMachineDto) {
    return this.prisma.machine.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.machine.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.machine.findUnique({
      where: { id },
    });
  }

  async update(id: number, dto: UpdateMachineDto) {
    const updatedMachine = await this.prisma.machine.update({
      where: { id },
      data: dto,
    });

    await this.logsService.createLog(
      id,
      `Machine status changed to ${updatedMachine.status}`,
    );

    if (updatedMachine.temperature >= 90) {
      await this.alarmsService.createAlarm(
        updatedMachine.id,
        `High temperature detected: ${updatedMachine.temperature}°C`,
        'CRITICAL',
      );
    }

    this.gateway.sendMachineUpdate(updatedMachine);

    return updatedMachine;
  }

  async remove(id: number) {
    return this.prisma.machine.delete({
      where: { id },
    });
  }
}
