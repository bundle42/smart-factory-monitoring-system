import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { AlarmsService } from './alarms.service';

@UseGuards(JwtAuthGuard)
@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Get()
  getAlarms() {
    return this.alarmsService.getAlarms();
  }
}
