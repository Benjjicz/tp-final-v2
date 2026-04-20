import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { ProyectoEntity } from './proyecto.entity';

@Entity('tareas')
export class TareaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: false })
  descripcion!: string;

  @Column({ type: 'enum', enum: EstadosTareasEnum, default: EstadosTareasEnum.PENDIENTE })
  estado!: EstadosTareasEnum;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.tareas)
  @JoinColumn({ name: 'id_proyecto' })
  proyecto!: ProyectoEntity;

  @Column({ name: 'id_proyecto', nullable: false })
  idProyecto!: number;
}