export enum Rol {
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN'
}

export enum TipoMantenimiento {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}

export enum EstadoMantenimiento {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum EstadoVehiculo {
  AVAILABLE = 'AVAILABLE',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  INACTIVE = ' INACTIVE',
}
