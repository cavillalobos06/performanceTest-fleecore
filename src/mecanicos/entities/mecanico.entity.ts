import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, Relation, OneToMany } from 'typeorm';
import { Usuario } from '../../auth/user.entity.js';
import { Mantenimiento } from '../../mantenimientos/entities/mantenimiento.entity.js';


@Entity('Mecanicos')
export class Mecanico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  especialidad: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'int', nullable: true })
  usuarioId: number | null;

  @OneToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Relation<Usuario> | null;

  @OneToMany(() => Mantenimiento, (m) => m.mecanico)
  mantenimientos: Relation<Mantenimiento[]>;
}