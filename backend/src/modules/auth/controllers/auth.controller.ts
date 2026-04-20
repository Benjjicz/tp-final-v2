import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/input/login.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({ description: 'Login exitoso. Devuelve el token JWT.' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas o usuario inactivo.' })
  async login(@Body() dto: LoginDto): Promise<{ token: string }> {
    return await this.authService.login(dto);
  }
}