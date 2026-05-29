export interface Machine {
  id: number;
  name: string;
  location: string;
  status: string;
  temperature: number;
  productionCount: number;
}

export interface MachineReading {
  id: number;
  machineId: number;
  status: string;
  temperature: number;
  productionCount: number;
  createdAt: string;
}
