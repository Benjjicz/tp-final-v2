import { Body, Controller, Get, Param, Post, Put, Query, ParseIntPipe } from "@nestjs/common";
import { CreateProyectoDto } from "../dtos/input/create-proyecto.dto";
import { UpdateProyectoDto } from "../dtos/input/update-proyecto.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ListProyectoDTO } from "../dtos/output/list-proyecto.dto";
import { EstadosProyectosEnum } from "../enums/estados-proyectos.enum";
import { ProyectosService } from "../services/proyectos.service";

@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectosController {

    constructor(private readonly proyectosService: ProyectosService) { }

    @ApiBearerAuth()
    @Post()
    async crearProyecto(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {
        return await this.proyectosService.crearProyecto(dto);
    }

    @ApiBearerAuth()
    @Put(":id")
    async actualizarProyecto(
        @Param("id", ParseIntPipe) id: number, 
        @Body() dto: UpdateProyectoDto
    ): Promise<void> {
        await this.proyectosService.actualizarProyecto(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListProyectoDTO, isArray: true })
    @Get()
    async obtenerProyectos(@Query("estado") estado?: EstadosProyectosEnum): Promise<ListProyectoDTO[]> {
        const proyectos = await this.proyectosService.obtenerProyectos(estado);
        // Mapeo básico para respetar el DTO de salida
        return proyectos.map(p => ({
            id: p.id,
            nombre: p.nombre,
            estado: p.estado,
            idCliente: p.idCliente,
            nombreCliente: p.cliente ? p.cliente.nombre : null
        } as unknown as ListProyectoDTO)); // Ajusta el casteo según las propiedades reales de tu ListProyectoDTO
    }
}