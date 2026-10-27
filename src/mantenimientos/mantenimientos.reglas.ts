import { BadRequestException, ConflictException } from '@nestjs/common';
import { EstadoMantenimiento } from '../common/enum.js';

export const ACTIVE_STATUSES = [
  EstadoMantenimiento.SCHEDULED,
  EstadoMantenimiento.IN_PROGRESS,
];

export const ALLOWED_TRANSITIONS: Record<
  EstadoMantenimiento,
  EstadoMantenimiento[]
> = {
  [EstadoMantenimiento.SCHEDULED]: [
    EstadoMantenimiento.IN_PROGRESS,
    EstadoMantenimiento.CANCELLED,
  ],
  [EstadoMantenimiento.IN_PROGRESS]: [
    EstadoMantenimiento.COMPLETED,
    EstadoMantenimiento.CANCELLED,
  ],
  [EstadoMantenimiento.COMPLETED]: [],
  [EstadoMantenimiento.CANCELLED]: [],
};

export function assertValidTransition(
  from: EstadoMantenimiento,
  to: EstadoMantenimiento,
): void {
  if (ALLOWED_TRANSITIONS[from].includes(to)) return;

  let reason: string;
  if (from === EstadoMantenimiento.COMPLETED) {
    reason = 'Un mantenimiento COMPLETED no puede volver a un estado anterior';
  } else if (from === EstadoMantenimiento.CANCELLED) {
    reason = 'Un mantenimiento CANCELLED no puede cambiar a otro estado';
  } else if (from === to) {
    reason = `El mantenimiento ya está en estado ${from}`;
  } else {
    reason = `Transición inválida de ${from} a ${to}`;
  }
  throw new ConflictException(
    `${reason}. Transiciones permitidas desde ${from}: ${ALLOWED_TRANSITIONS[from].join(', ') || 'ninguna'}`,
  );
}

export function assertClosingData(data: {
  trabajoRealizado?: string;
  costoFinal?: number;
  finishedAt?: string;
  kilometraje?: number;
}): void {
  const missing: string[] = [];
  if (!data.trabajoRealizado || !data.trabajoRealizado.trim())
    missing.push('workDone (trabajo realizado)');
  if (data.costoFinal === undefined || data.costoFinal === null)
    missing.push('finalCost (costo final)');
  if (!data.finishedAt) missing.push('finishedAt (fecha de finalización)');
  if (data.kilometraje === undefined || data.kilometraje === null)
    missing.push('finalMileage (kilometraje final)');

  if (missing.length > 0) {
    throw new BadRequestException(
      `Para completar el mantenimiento falta: ${missing.join(', ')}`,
    );
  }
}
