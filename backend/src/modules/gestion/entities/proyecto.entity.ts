import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { ClienteEntity } from './cliente.entity';
import { TareaEntity } from './tarea.entity';

@Entity('proyectos')
export class ProyectoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true, nullable: false })
  nombre!: string;

  @Column({ type: 'enum', enum: EstadosProyectosEnum, default: EstadosProyectosEnum.ACTIVO })
  estado!: EstadosProyectosEnum;

  // ESTA ES LA RELACIÓN QUE MANDA: TypeORM usará esto para guardar e hidratar el cliente
  @ManyToOne(() => ClienteEntity, (cliente) => cliente.proyectos, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente!: ClienteEntity;

  // PROPIEDAD DE SOLO LECTURA: Así no pelea con la relación de arriba por la misma columna
  @Column({ name: 'id_cliente', nullable: true, insert: false, update: false })
  idCliente!: number;

  @OneToMany(() => TareaEntity, (tarea) => tarea.proyecto)
  tareas!: TareaEntity[];
}