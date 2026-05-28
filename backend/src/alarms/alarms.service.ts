import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlarmsService {
  constructor(private prisma: PrismaService) {}

  async createAlarm(
    machineId: number,
    message: string,
    level: 'WARNING' | 'CRITICAL',
  ) {
    return this.prisma.alarm.create({
      data: {
        machineId,
        message,
        level,
      },
    });
  }

  async getAlarms() {
    return this.prisma.alarm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
