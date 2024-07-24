import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { AuthRequest } from './models/AuthRequest';
import { UsuarioAtual } from './decorators/usuario-atual.decorator';
import { IsPublic } from './decorators/is-public.decorator';
import { Usuario } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@ApiTags('autenticação e autorização')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @IsPublic()
  async login(@Req() req: AuthRequest, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @IsPublic()
  @UseGuards(RefreshAuthGuard)
  async refresh(@UsuarioAtual() usuario: Usuario) {
    return this.authService.refresh(usuario);
  }

  @Get('eu')
  @IsPublic()
  async usuarioAtual(@UsuarioAtual() usuario: Usuario) {
    return usuario;
  }
}
