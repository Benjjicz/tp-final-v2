import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioEntity } from '../entities/usuario.entity';
import { LoginDto } from '../dtos/input/login.dto';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepo: Repository<UsuarioEntity>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto): Promise<{ token: string }> {
    // 1. Buscar al usuario
    const usuario = await this.usuarioRepo.findOne({ where: { nombre: dto.nombre } });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Validar que no esté dado de baja
    if (usuario.estado !== EstadosUsuariosEnum.ACTIVO) {
      throw new UnauthorizedException('El usuario no se encuentra activo en el sistema');
    }

    // 3. Comparar contraseñas (bcrypt entiende el hash generado por pgcrypto)
    const passwordMatch = await bcrypt.compare(dto.clave, usuario.clave);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 4. Generar el Token JWT
    const payload = { sub: usuario.id, nombre: usuario.nombre };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }
}