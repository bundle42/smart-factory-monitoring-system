import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SimulatorService } from './simulator.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Get()
  status() {
    return this.simulatorService.getStatus();
  }

  @Roles('ADMIN')
  @Post('start')
  start() {
    return this.simulatorService.start();
  }

  @Roles('ADMIN')
  @Post('stop')
  stop() {
    return this.simulatorService.stop();
  }

  @Roles('ADMIN')
  @Post('tick')
  tick() {
    return this.simulatorService.tick();
  }

  @Roles('ADMIN')
  @Post('reset')
  reset() {
    return this.simulatorService.reset();
  }
}
