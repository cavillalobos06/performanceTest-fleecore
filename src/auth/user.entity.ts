import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from '../common/enum.js';

@Entity('Usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column({ select: false })
  contraseña: string;

  @Column({ type: 'enum', enum: Rol })
  role: Rol;

  @CreateDateColumn()
  createdAt: Date;
}
