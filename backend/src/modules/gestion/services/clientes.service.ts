import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly clienteRepo: Repository<ClienteEntity>,
  ) {}

  async crearCliente(dto: CreateClienteDto): Promise<{ id: number }> {
    const existe = await this.clienteRepo.findOne({ where: { nombre: dto.nombre } });
    if (existe) {
      throw new ConflictException(`El cliente '${dto.nombre}' ya está registrado.`);
    }

    const cliente = this.clienteRepo.create({ nombre: dto.nombre, estado: EstadosClientesEnum.ACTIVO });
    const guardado = await this.clienteRepo.save(cliente);
    return { id: guardado.id };
  }

  async obtenerClientes(estado?: EstadosClientesEnum): Promise<ClienteEntity[]> {
    const query = this.clienteRepo.createQueryBuilder('cliente');
    if (estado) query.where('cliente.estado = :estado', { estado });
    return await query.orderBy('cliente.id', 'ASC').getMany();
  }

  async actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void> {
    const cliente = await this.clienteRepo.findOne({ 
      where: { id },
      relations: ['proyectos'] 
    });

    if (!cliente) throw new NotFoundException(`Cliente no encontrado.`);

    // Regla de Negocio: Validación de Baja
    if (dto.estado === EstadosClientesEnum.BAJA && cliente.estado !== EstadosClientesEnum.BAJA) {
      if (cliente.proyectos && cliente.proyectos.length > 0) {
        throw new BadRequestException('No se puede dar de baja un cliente registrado en proyectos.');
      }
    }

    if (dto.nombre) cliente.nombre = dto.nombre;
    if (dto.estado) cliente.estado = dto.estado;

    try {
      await this.clienteRepo.save(cliente);
    } catch (error) {
      throw new ConflictException('El nombre del cliente ya está en uso.');
    }
  }
}