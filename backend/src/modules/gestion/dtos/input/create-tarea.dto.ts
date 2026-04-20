import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({ description: 'Descripción detallada de la tarea' })
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty({ description: 'ID del proyecto al que pertenece la tarea' })
  @IsInt()
  @IsNotEmpty()
  idProyecto!: number;
}