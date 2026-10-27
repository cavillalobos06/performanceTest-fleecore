import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { TipoMantenimiento, EstadoMantenimiento } from '../../common/enum.js';
import { Mecanico } from '../../mecanicos/entities/mecanico.entity.js';
import { Taller } from '../../talleres/entities/taller.entity.js';
import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity.js';

@Entity('Mantenimientos')
export class Mantenimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoMantenimiento })
  tipo: TipoMantenimiento;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'int' })
  kilometraje: number;

  @Column({ type: 'timestamptz' })
  fechaProgramada: Date;

  @Column({ type: 'timestamptz' })
  fechaFinalizacion: Date;

  @Column({
    type: 'enum',
    enum: EstadoMantenimiento,
    default: EstadoMantenimiento.SCHEDULED,
  })
  estado: EstadoMantenimiento;

  @Column({ type: 'text', nullable: true })
  trabajoRealizado: string | null;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  costoFinal: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @Column()
  vehiculoId: number;

  @Column({ type: 'int', nullable: true })
  kilometrajeFinal: number | null;

  @ManyToOne(() => Vehiculo, (v) => v.maintenances, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'vehicleId' })
  vehiculo: Relation<Vehiculo>;

  @Column()
  mecanicoId: number;

  @ManyToOne(() => Mecanico, (m) => m.mantenimientos, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'mecanicoId' })
  mecanico: Relation<Mecanico>;

  @Column()
  tallerId: number;

  @ManyToOne(() => Taller, (w) => w.mantenimientos, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'tallerId' })
  taller: Relation<Taller>;

  @CreateDateColumn()
  createdAt: Date;
}
