import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MachineStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MachineGateway } from '../websocket/machine.gateway';
import { AlarmsService } from '../alarms/alarms.service';
import { LogsService } from '../logs/logs.service';

type VirtualMachineProfile = {
  name: string;
  location: string;
  baseTemperature: number;
  maxOutputPerTick: number;
  drift: number;
};

@Injectable()
export class SimulatorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SimulatorService.name);
  private readonly intervalMs = Number(
    process.env.SIMULATOR_INTERVAL_MS ?? 5000,
  );
  private timer?: NodeJS.Timeout;
  private running = false;
  private ticks = 0;

  private readonly profiles: VirtualMachineProfile[] = [
    {
      name: 'CNC Line A',
      location: 'Factory 1 / Cutting',
      baseTemperature: 58,
      maxOutputPerTick: 7,
      drift: 0.8,
    },
    {
      name: 'Assembly Robot B',
      location: 'Factory 1 / Assembly',
      baseTemperature: 46,
      maxOutputPerTick: 10,
      drift: 0.5,
    },
    {
      name: 'Paint Booth C',
      location: 'Factory 2 / Finishing',
      baseTemperature: 64,
      maxOutputPerTick: 5,
      drift: 1.1,
    },
    {
      name: 'Packaging Line D',
      location: 'Factory 2 / Packaging',
      baseTemperature: 42,
      maxOutputPerTick: 12,
      drift: 0.4,
    },
  ];

  constructor(
    private prisma: PrismaService,
    private gateway: MachineGateway,
    private alarmsService: AlarmsService,
    private logsService: LogsService,
  ) {}

  async onModuleInit() {
    await this.ensureVirtualMachines();

    if (process.env.SIMULATOR_ENABLED !== 'false') {
      this.start();
    }
  }

  onModuleDestroy() {
    this.stop();
  }

  getStatus() {
    return {
      running: this.running,
      intervalMs: this.intervalMs,
      ticks: this.ticks,
      autoStart: process.env.SIMULATOR_ENABLED !== 'false',
    };
  }

  start() {
    if (this.running) {
      return this.getStatus();
    }

    this.running = true;
    this.timer = setInterval(() => {
      void this.tick();
    }, this.intervalMs);

    this.logger.log(`Virtual factory simulator started (${this.intervalMs}ms)`);
    return this.getStatus();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    this.running = false;
    return this.getStatus();
  }

  async tick() {
    await this.ensureVirtualMachines();

    const machines = await this.prisma.machine.findMany({
      orderBy: { id: 'asc' },
    });

    const updates = await Promise.all(
      machines.map(async (machine, index) => {
        const profile = this.profiles[index % this.profiles.length];
        const nextStatus = this.nextStatus(machine.status);
        const nextTemperature = this.nextTemperature(
          machine.temperature,
          profile.baseTemperature,
          profile.drift,
          nextStatus,
        );
        const productionDelta =
          nextStatus === MachineStatus.RUNNING
            ? this.randomInt(1, profile.maxOutputPerTick)
            : 0;

        const updatedMachine = await this.prisma.machine.update({
          where: { id: machine.id },
          data: {
            status: nextStatus,
            temperature: nextTemperature,
            productionCount: machine.productionCount + productionDelta,
          },
        });

        await this.recordEvents(
          machine.id,
          machine.status,
          nextStatus,
          nextTemperature,
        );

        this.gateway.sendMachineUpdate(updatedMachine);
        return updatedMachine;
      }),
    );

    this.ticks += 1;
    return {
      ...this.getStatus(),
      updatedMachines: updates.length,
    };
  }

  async reset() {
    await this.ensureVirtualMachines();

    const machines = await this.prisma.machine.findMany({
      orderBy: { id: 'asc' },
    });

    const updates = await Promise.all(
      machines.map(async (machine, index) => {
        const profile = this.profiles[index % this.profiles.length];
        const updatedMachine = await this.prisma.machine.update({
          where: { id: machine.id },
          data: {
            status: MachineStatus.RUNNING,
            temperature: profile.baseTemperature,
            productionCount: 0,
          },
        });

        this.gateway.sendMachineUpdate(updatedMachine);
        return updatedMachine;
      }),
    );

    this.ticks = 0;
    return {
      ...this.getStatus(),
      updatedMachines: updates.length,
    };
  }

  private async ensureVirtualMachines() {
    const count = await this.prisma.machine.count();

    if (count > 0) {
      return;
    }

    await this.prisma.machine.createMany({
      data: this.profiles.map((profile) => ({
        name: profile.name,
        location: profile.location,
        status: MachineStatus.RUNNING,
        temperature: profile.baseTemperature,
        productionCount: 0,
      })),
      skipDuplicates: true,
    });
  }

  private nextStatus(currentStatus: MachineStatus) {
    const roll = Math.random();

    if (currentStatus === MachineStatus.ERROR) {
      return roll < 0.45 ? MachineStatus.RUNNING : MachineStatus.ERROR;
    }

    if (currentStatus === MachineStatus.MAINTENANCE) {
      return roll < 0.3 ? MachineStatus.RUNNING : MachineStatus.MAINTENANCE;
    }

    if (roll < 0.03) {
      return MachineStatus.ERROR;
    }

    if (roll < 0.08) {
      return MachineStatus.MAINTENANCE;
    }

    if (roll < 0.12) {
      return MachineStatus.STOPPED;
    }

    return MachineStatus.RUNNING;
  }

  private nextTemperature(
    currentTemperature: number,
    baseTemperature: number,
    drift: number,
    status: MachineStatus,
  ) {
    const targetTemperature =
      status === MachineStatus.RUNNING ? baseTemperature : baseTemperature - 12;
    const movement = (targetTemperature - currentTemperature) * 0.28;
    const noise = (Math.random() - 0.35) * drift * 8;
    const spike = Math.random() < 0.04 ? this.randomInt(12, 28) : 0;

    return Math.max(
      20,
      Math.round((currentTemperature + movement + noise + spike) * 10) / 10,
    );
  }

  private async recordEvents(
    machineId: number,
    previousStatus: MachineStatus,
    nextStatus: MachineStatus,
    temperature: number,
  ) {
    if (previousStatus !== nextStatus) {
      await this.logsService.createLog(
        machineId,
        `Simulator status changed from ${previousStatus} to ${nextStatus}`,
      );
    }

    if (temperature >= 90) {
      await this.alarmsService.createAlarm(
        machineId,
        `Simulator high temperature detected: ${temperature}°C`,
        'CRITICAL',
      );
    } else if (temperature >= 78) {
      await this.alarmsService.createAlarm(
        machineId,
        `Simulator temperature warning: ${temperature}°C`,
        'WARNING',
      );
    }
  }

  private randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
