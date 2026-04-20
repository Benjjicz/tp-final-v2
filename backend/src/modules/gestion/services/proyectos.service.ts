import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from '../entities/proyecto.entity';
import { ClienteEntity } from '../entities/cliente.entity';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepo: Repository<ProyectoEntity>,
    @InjectRepository(ClienteEntity)
    private readonly clienteRepo: Repository<ClienteEntity>,
  ) {}

  async crearProyecto(dto: CreateProyectoDto): Promise<{ id: number }> {
    const existe = await this.proyectoRepo.findOne({ where: { nombre: dto.nombre } });
    if (existe) {
      throw new ConflictException(`El proyecto '${dto.nombre}' ya existe.`);
    }

    const nuevoProyecto = this.proyectoRepo.create({
      nombre: dto.nombre,
      estado: EstadosProyectosEnum.ACTIVO,
    });

    if (dto.idCliente) {
      const cliente = await this.clienteRepo.findOne({ where: { id: dto.idCliente } });
      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${dto.idCliente} no encontrado.`);
      }
      if (cliente.estado !== EstadosClientesEnum.ACTIVO) {
        throw new BadRequestException('Solo se pueden asociar clientes en estado ACTIVO a un proyecto.');
      }
      // CORRECCIÓN 1: Pasamos el objeto 'cliente', no el ID
      nuevoProyecto.cliente = cliente as any; 
    }

    const guardado = await this.proyectoRepo.save(nuevoProyecto);
    return { id: guardado.id };
  }

  async actualizarProyecto(id: number, dto: UpdateProyectoDto): Promise<void> {
    const proyecto = await this.proyectoRepo.findOne({ where: { id } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado.`);
    }

    if (dto.nombre) proyecto.nombre = dto.nombre;
    if (dto.estado) proyecto.estado = dto.estado;

    if (dto.idCliente !== undefined) {
      if (!dto.idCliente) {
        // CORRECCIÓN 2: Limpiamos la relación 'cliente', no el idCliente
        proyecto.cliente = null as any; 
      } else {
        const cliente = await this.clienteRepo.findOne({ where: { id: dto.idCliente } });
        if (!cliente) throw new NotFoundException(`Cliente no encontrado.`);
        if (cliente.estado !== EstadosClientesEnum.ACTIVO) {
          throw new BadRequestException('Solo se pueden asociar clientes en estado ACTIVO a un proyecto.');
        }
        // CORRECCIÓN 3: Pasamos el objeto 'cliente'
        proyecto.cliente = cliente as any;
      }
    }

    try {
      await this.proyectoRepo.save(proyecto);
    } catch (error) {
      throw new ConflictException('El nombre del proyecto ya está en uso.');
    }
  }

  async obtenerProyectos(estado?: EstadosProyectosEnum): Promise<ProyectoEntity[]> {
    const query = this.proyectoRepo.createQueryBuilder('proyecto')
      .leftJoinAndSelect('proyecto.cliente', 'cliente') 
      .leftJoinAndSelect('proyecto.tareas', 'tareas');  

    if (estado) {
      query.where('proyecto.estado = :estado', { estado });
    }

    return await query.orderBy('proyecto.id', 'ASC').getMany();
  }
}