import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true, nullable: false })
  nombre!: string;

  @Column({ type: 'text', nullable: false })
  clave!: string;

  @Column({ type: 'enum', enum: EstadosUsuariosEnum, default: EstadosUsuariosEnum.ACTIVO })
  estado!: EstadosUsuariosEnum;
}