import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Relation } from 'typeorm';
import { EstadoVehiculo } from '../../common/enum.js';
import { Mantenimiento } from '../../mantenimientos/entities/mantenimiento.entity.js';

@Entity('Vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  placa: string;

  @Column({ type: 'varchar' })
  marca: string;

  @Column({ type: 'varchar' })
  modelo: string;

  @Column({ type: 'int' })
  año: number;

  @Column({ type: 'int' })
  kilometraje: number;

  @Column({ type: 'enum', enum: EstadoVehiculo })
  estado: EstadoVehiculo;

  @OneToMany(() => Mantenimiento, (m) => m.vehiculo)
  maintenances: Relation<Mantenimiento[]>;
}
