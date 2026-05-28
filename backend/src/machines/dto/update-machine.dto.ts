export class UpdateMachineDto {
  name?: string;
  location?: string;
  status?: 'RUNNING' | 'STOPPED' | 'MAINTENANCE' | 'ERROR';
  temperature?: number;
  productionCount?: number;
}
