import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { Usuario } from '../auth/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly users: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  // Crea un usuario nuevo después de validar los datos recibidos.
  async register(dto: RegisterDto) {
    const correo = dto.correo.toLowerCase();
    if (await this.users.findOne({ where: { correo } })) {
      throw new ConflictException(`El correo ${correo} ya está registrado`);
    }

    const saltRounds = 10;
    const contraseña = await bcrypt.hash(dto.contraseña, saltRounds);

    const saved = await this.users.save(
      this.users.create({
        nombre: dto.nombre,
        correo,
        contraseña,
        role: dto.rol,
      }),
    );
    return {
      id: saved.id,
      nombre: saved.nombre,
      correo: saved.correo,
      role: saved.role,
    };
  }

  // Valida las credenciales y genera el token para las solicitudes autenticadas.
  async login(dto: LoginDto) {
  const user = await this.users
  .createQueryBuilder('u')
  .addSelect('u.contraseña')
  .where('u.correo = :correo', {
    correo: dto.correo.toLowerCase(),
  })
  .getOne();

    if (!user || !(await bcrypt.compare(dto.contraseña, user.contraseña))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.correo,
      role: user.role,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.nombre,
        email: user.correo,
        role: user.role,
      },
    };
  }
}
