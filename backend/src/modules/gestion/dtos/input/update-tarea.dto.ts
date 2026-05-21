import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';

export class UpdateTareaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ enum: EstadosTareasEnum })
  @IsOptional()
  @IsEnum(EstadosTareasEnum)
  estado?: EstadosTareasEnum;

  @ApiPropertyOptional({ description: 'Permite reasignar la tarea a otro proyecto' })
  @IsOptional()
  @IsInt()
  idProyecto?: number;
}