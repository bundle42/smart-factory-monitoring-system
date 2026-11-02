import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { LogsService } from './logs.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get(':machineId')
  getMachineLogs(@Param('machineId') machineId: string) {
    return this.logsService.getMachineLogs(Number(machineId));
  }
}
