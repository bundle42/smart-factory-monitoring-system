import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(machineId: number, message: string) {
    return this.prisma.log.create({
      data: {
        machineId,
        message,
      },
    });
  }

  async getMachineLogs(machineId: number) {
    return this.prisma.log.findMany({
      where: {
        machineId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
