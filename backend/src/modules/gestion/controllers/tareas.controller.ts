import { Body, Controller, Get, Param, Post, Put, Delete, Query, ParseIntPipe } from "@nestjs/common";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { TareasService } from "../services/tareas.service";

@ApiTags('Tareas')
@Controller('tareas')
export class TareasController {

    constructor(private readonly tareasService: TareasService) {}

    @ApiBearerAuth()
    @Post()
    async crearTarea(@Body() dto: CreateTareaDto): Promise<{ id: number }> {
        return await this.tareasService.crearTarea(dto);
    }

    @ApiBearerAuth()
    @Put(":id")
    async actualizarTarea(
        @Param("id", ParseIntPipe) id: number, 
        @Body() dto: UpdateTareaDto
    ): Promise<void> {
        await this.tareasService.actualizarTarea(id, dto);
    }

    @ApiBearerAuth()
    @Delete(":id")
    async eliminarTarea(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.tareasService.eliminarTarea(id);
    }

    @Get()
    async obtenerTareas(@Query("idProyecto") idProyecto?: number) {
        const tareas = await this.tareasService.obtenerTareas(idProyecto);
        // Mapeamos para devolver el objeto 'proyecto' que espera el Frontend
        return tareas.map(t => ({
            id: t.id,
            descripcion: t.descripcion,
            estado: t.estado,
            proyecto: t.proyecto ? { id: t.proyecto.id, nombre: t.proyecto.nombre } : null
        })); 
    }
}