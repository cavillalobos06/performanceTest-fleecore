import 'dotenv/config';
import { DataSource, DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../auth/user.entity.js'
import {
  EstadoMantenimiento,
  TipoMantenimiento,
  Rol,
  EstadoVehiculo,
} from '../common/enum.js';
import { ENTIDADES } from '../database/entities.js';
import { Mantenimiento } from '../mantenimientos/entities/mantenimiento.entity.js';
import { Mecanico } from '../mecanicos/entities/mecanico.entity.js';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity.js';
import { Taller } from '../talleres/entities/taller.entity.js';

async function findOrCreate<T extends ObjectLiteral>(
  ds: DataSource,
  entity: EntityTarget<T>,
  where: Partial<T>,
  data: DeepPartial<T>,
): Promise<T> {
  const repo = ds.getRepository(entity);
  const existing = await repo.findOne({ where: where as any });
  if (existing) return existing;
  return repo.save(repo.create(data));
}

async function run() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ENTIDADES,
    synchronize: true,
  });
  await ds.initialize();

  const saltRounds = 10;

  // ---- Usuarios ----
  const adminPass = await bcrypt.hash('Admin123*', saltRounds);
  const techPass = await bcrypt.hash('Tech123*', saltRounds);
  const admin = await findOrCreate(
    ds,
    Usuario,
    { correo: 'admin@fleetcore.com' },
    {
      nombre: 'Administrador',
      correo: 'admin@fleetcore.com',
      contraseña: adminPass,
      role: Rol.ADMIN,
    },
  );
  const tech1 = await findOrCreate(
    ds,
    Usuario,
    { correo: 'tecnico1@fleetcore.com' },
    {
      nombre: 'Carlos Pérez',
      correo: 'tecnico1@fleetcore.com',
      contraseña: techPass,
      role: Rol.TECHNICIAN,
    },
  );
  const tech2 = await findOrCreate(
    ds,
    Usuario,
    { correo: 'tecnico2@fleetcore.com' },
    {
      nombre: 'Laura Gómez',
      correo: 'tecnico2@fleetcore.com',
      contraseña: techPass,
      role: Rol.TECHNICIAN,
    },
  );

  // ---- Mecánicos (2 activos vinculados a los técnicos y 1 inactivo) ----
  const carlos = await findOrCreate(
    ds,
    Mecanico,
    { correo: 'carlos.perez@fleetcore.com' },
    {
      nombre: 'Carlos Pérez',
      correo: 'carlos.perez@fleetcore.com',
      especialidad: 'Motor y transmisión',
      activo: true,
      usuarioId: tech1.id,
    },
  );
  const laura = await findOrCreate(
    ds,
    Mecanico,
    { correo: 'laura.gomez@fleetcore.com' },
    {
      nombre: 'Laura Gómez',
      correo: 'laura.gomez@fleetcore.com',
      especialidad: 'Frenos y suspensión',
      activo: true,
      usuarioId: tech2.id,
    },
  );
  await findOrCreate(
    ds,
    Mecanico,
    { correo: 'pedro.ruiz@fleetcore.com' },
    {
      nombre: 'Pedro Ruiz',
      correo: 'pedro.ruiz@fleetcore.com',
      especialidad: 'Electricidad',
      activo: false,
      usuarioId: null,
    },
  );

  // ---- Talleres (1 activo y 1 inactivo) ----
  const centro = await findOrCreate(
    ds,
    Taller,
    { nombre: 'Taller Centro' },
    {
      nombre: 'Taller Centro',
      direccion: 'Calle 10 # 5-20, Centro',
      activo: true,
    },
  );
  await findOrCreate(
    ds,
    Taller,
    { nombre: 'Taller Norte' },
    { nombre: 'Taller Norte', direccion: 'Av. Norte # 80-15', activo: false },
  );

  // ---- Vehículos (2 AVAILABLE, 1 IN_MAINTENANCE, 1 INACTIVE) ----
  const abc = await findOrCreate(
    ds,
    Vehiculo,
    { placa: 'ABC123' },
    {
      placa: 'ABC123',
      marca: 'Chevrolet',
      modelo: 'NPR',
      año: 2022,
      kilometraje: 45000,
      estado: EstadoVehiculo.AVAILABLE,
    },
  );
  await findOrCreate(
    ds,
    Vehiculo,
    { placa: 'DEF456' },
    {
      placa: 'DEF456',
      marca: 'Hino',
      modelo: '300',
      año: 2021,
      kilometraje: 62000,
      estado: EstadoVehiculo.AVAILABLE,
    },
  );
  const ghi = await findOrCreate(
    ds,
    Vehiculo,
    { placa: 'GHI789' },
    {
      placa: 'GHI789',
      marca: 'Isuzu',
      modelo: 'NKR',
      año: 2020,
      kilometraje: 80000,
      estado: EstadoVehiculo.IN_MAINTENANCE,
    },
  );
  await findOrCreate(
    ds,
    Vehiculo,
    { placa: 'JKL012' },
    {
      placa: 'JKL012',
      marca: 'Foton',
      modelo: 'Aumark',
      año: 2018,
      kilometraje: 150000,
      estado: EstadoVehiculo.INACTIVE,
    },
  );

  // ---- Mantenimientos ----
  const now = Date.now();
  const hour = 3_600_000;

  // 1 COMPLETED (para mostrar historial)
  await findOrCreate(
    ds,
    Mantenimiento,
    { descripcion: 'Cambio de aceite y filtros', vehiculoId: abc.id },
    {
      tipo: TipoMantenimiento.PREVENTIVE,
      descripcion: 'Cambio de aceite y filtros',
      kilometraje: 44800,
      fechaProgramada: new Date(now - 48 * hour),
      fechaFinalizacion: new Date(now - 47 * hour),
      estado: EstadoMantenimiento.COMPLETED,
      trabajoRealizado: 'Cambio de aceite y filtros de aire y combustible',
      costoFinal: 350000,
      finishedAt: new Date(now - 47 * hour),
      kilometrajeFinal: 45000,
      vehiculoId: abc.id,
      mecanicoId: laura.id,
      tallerId: centro.id,
    },
  );

  // 1 IN_PROGRESS (el vehículo GHI789 está IN_MAINTENANCE por este trabajo)
  await findOrCreate(
    ds,
    Mantenimiento,
    { descripcion: 'Reemplazo de pastillas de freno', vehiculoId: ghi.id },
    {
      tipo: TipoMantenimiento.CORRECTIVE,
      descripcion: 'Reemplazo de pastillas de freno',
      kilometraje: 80000,
      fechaProgramada: new Date(now - hour),
      fechaFinalizacion: new Date(now + 2 * hour),
      estado: EstadoMantenimiento.IN_PROGRESS,
      vehiculoId: ghi.id,
      mecanicoId: carlos.id,
      tallerId: centro.id,
    },
  );

  console.log(
    'Seeder ejecutado correctamente (se puede repetir sin duplicar datos).',
  );
  console.log(
    `Admin: ${admin.correo} / Admin123*  |  Técnicos: ${tech1.correo}, ${tech2.correo} / Tech123*`,
  );
  await ds.destroy();
}

run().catch((e) => {
  console.error('Error en el seeder:', e);
  process.exit(1);
});
