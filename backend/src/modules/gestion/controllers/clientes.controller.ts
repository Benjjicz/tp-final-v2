import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Put, 
    Query, 
    UseGuards, 
    ParseIntPipe 
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { ClientesService } from "../services/clientes.service";
import { AuthGuard } from "../../auth/guards/auth.guard";

@ApiTags('Clientes')
@UseGuards(AuthGuard)
@Controller('clientes')
export class ClientesController {

    constructor(private readonly clientesService: ClientesService) { }

    @ApiBearerAuth()
    @Post()
    async crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
        return await this.clientesService.crearCliente(dto);
    }

    @ApiBearerAuth()
    @Put(":id")
    async actualizarCliente(
        @Param("id", ParseIntPipe) id: number, 
        @Body() dto: UpdateClienteDto
    ): Promise<void> {
        await this.clientesService.actualizarCliente(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListClienteDTO, isArray: true })
    @Get()
    async obtenerClientes(@Query("estado") estado?: EstadosClientesEnum): Promise<ListClienteDTO[]> {
        const clientes = await this.clientesService.obtenerClientes(estado);
        
        // Mapeamos las entidades al DTO de salida para mantener la estructura de la respuesta
        return clientes.map(cliente => ({
            id: cliente.id,
            nombre: cliente.nombre,
            estado: cliente.estado
        } as ListClienteDTO));
    }

}