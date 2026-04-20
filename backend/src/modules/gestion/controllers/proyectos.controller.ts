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
    async obtenerProyectos(@Query("estado") estado?: EstadosProyectosEnum) {
        const proyectos = await this.proyectosService.obtenerProyectos(estado);
        
        
        return proyectos.map(p => ({
            id: p.id,
            nombre: p.nombre,
            estado: p.estado,
            // Mandamos el objeto cliente completo (si existe)
            cliente: p.cliente ? { id: p.cliente.id, nombre: p.cliente.nombre } : null
        })); 
    }
}