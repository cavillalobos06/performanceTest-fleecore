import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Relation } from "typeorm";
import { Mantenimiento } from "../../mantenimientos/entities/mantenimiento.entity.js";

@Entity('Talleres')
export class Taller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  direccion: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Mantenimiento, (m) => m.taller)
  mantenimientos: Relation<Mantenimiento[]>;
}