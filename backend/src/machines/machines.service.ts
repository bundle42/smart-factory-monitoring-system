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

  async getReadings(id: number, range = 'day', from?: string, to?: string) {
    const now = new Date();
    const rangeStart = new Date(now);

    if (range === 'hour') {
      rangeStart.setHours(now.getHours() - 1);
    } else if (range === 'week') {
      rangeStart.setDate(now.getDate() - 7);
    } else {
      rangeStart.setDate(now.getDate() - 1);
    }

    const createdAt = {
      gte: from ? new Date(from) : rangeStart,
      lte: to ? new Date(to) : now,
    };

    return this.prisma.machineReading.findMany({
      where: {
        machineId: id,
        createdAt,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 500,
    });
  }

  async update(id: number, dto: UpdateMachineDto) {
    const previousMachine = await this.prisma.machine.findUnique({
      where: { id },
    });

    const updatedMachine = await this.prisma.machine.update({
      where: { id },
      data: dto,
    });

    if (previousMachine?.status !== updatedMachine.status) {
      await this.logsService.createLog(
        id,
        `Machine status changed from ${previousMachine?.status} to ${updatedMachine.status}`,
      );
    }

    await this.prisma.machineReading.create({
      data: {
        machineId: updatedMachine.id,
        status: updatedMachine.status,
        temperature: updatedMachine.temperature,
        productionCount: updatedMachine.productionCount,
      },
    });

    if (updatedMachine.temperature >= 90) {
      await this.alarmsService.createAlarm(
        updatedMachine.id,
        `High temperature detected: ${updatedMachine.temperature}°C`,
        'CRITICAL',
      );
      await this.logsService.createLog(
        updatedMachine.id,
        `Critical temperature detected: ${updatedMachine.temperature}°C`,
      );
    } else if (updatedMachine.temperature >= 80) {
      await this.alarmsService.createAlarm(
        updatedMachine.id,
        `Temperature warning detected: ${updatedMachine.temperature}°C`,
        'WARNING',
      );
      await this.logsService.createLog(
        updatedMachine.id,
        `Temperature warning detected: ${updatedMachine.temperature}°C`,
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
