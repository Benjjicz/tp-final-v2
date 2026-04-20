import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TareaEntity } from '../entities/tarea.entity';
import { ProyectoEntity } from '../entities/proyecto.entity';
import { CreateTareaDto } from '../dtos/input/create-tarea.dto';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(TareaEntity)
    private readonly tareaRepo: Repository<TareaEntity>,
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepo: Repository<ProyectoEntity>,
  ) {}

  async crearTarea(dto: CreateTareaDto): Promise<{ id: number }> {
    // 1. Validar que el proyecto exista
    const proyecto = await this.proyectoRepo.findOne({ where: { id: dto.idProyecto } });
    if (!proyecto) {
      throw new NotFoundException(`El proyecto con ID ${dto.idProyecto} no existe.`);
    }

    // 2. Crear la instancia de la tarea
    const nuevaTarea = this.tareaRepo.create({
      descripcion: dto.descripcion,
      estado: EstadosTareasEnum.PENDIENTE,
    });

    // 3. ASIGNACIÓN EXPLÍCITA: Se asigna el objeto proyecto para completar id_proyecto en la DB
    nuevaTarea.proyecto = proyecto as any;

    const guardado = await this.tareaRepo.save(nuevaTarea);
    return { id: guardado.id };
  }

  async actualizarTarea(id: number, dto: UpdateTareaDto): Promise<void> {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada.`);
    }

    if (dto.descripcion) tarea.descripcion = dto.descripcion;
    if (dto.estado) tarea.estado = dto.estado;

    // Si se reasigna el proyecto, buscamos y asignamos el objeto completo
    if (dto.idProyecto) {
      const proyecto = await this.proyectoRepo.findOne({ where: { id: dto.idProyecto } });
      if (!proyecto) {
        throw new NotFoundException(`El proyecto destino con ID ${dto.idProyecto} no existe.`);
      }
      tarea.proyecto = proyecto as any;
    }

    await this.tareaRepo.save(tarea);
  }

  async eliminarTarea(id: number): Promise<void> {
    const tarea = await this.tareaRepo.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada.`);
    }
    
    // Eliminación física
    await this.tareaRepo.remove(tarea);
  }

  async obtenerTareas(idProyecto?: number): Promise<TareaEntity[]> {
    const query = this.tareaRepo.createQueryBuilder('tarea')
      .leftJoinAndSelect('tarea.proyecto', 'proyecto');

    if (idProyecto) {
      query.where('tarea.id_proyecto = :idProyecto', { idProyecto });
    }

    return await query.orderBy('tarea.id', 'ASC').getMany();
  }
}