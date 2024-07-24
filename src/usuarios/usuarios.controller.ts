import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard'; 

@ApiTags('usuários')
@Controller('usuarios') //localhost:3000/usuarios
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('criar') //localhost:3000/usuarios/criar
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('SUP', 'ADM')
  criar(
    @UsuarioAtual() usuario: Usuario,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    return this.usuariosService.criar(createUsuarioDto, usuario);
  }

  @Get('buscar-tudo') //localhost:3000/usuarios/buscar-tudo
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('ADM', 'SUP')
  buscarTudo(
    @UsuarioAtual() usuario: Usuario,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('status') status?: string,
    @Query('busca') busca?: string,
    @Query('permissao') permissao?: string,
  ) {
    return this.usuariosService.buscarTudo(
      usuario,
      +pagina,
      +limite,
      +status,
      busca,
      permissao,
    );
  }

  @Get('buscar-por-id/:id') //localhost:3000/usuarios/buscar-por-id/id
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('ADM', 'SUP')
  buscarPorId(@Param('id') id: string) {
    return this.usuariosService.buscarPorId(id);
  }

  @Patch('atualizar/:id') //localhost:3000/usuarios/atualizar/id
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('ADM', 'SUP', 'USR')
  atualizar(
    @UsuarioAtual() usuario: Usuario,
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.atualizar(usuario, id, updateUsuarioDto);
  }

  @Get('lista-completa') //localhost:3000/usuarios/lista-completa
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('ADM', 'SUP', 'DEV')
  listaCompleta() {
    return this.usuariosService.listaCompleta();
  }

  @Delete('desativar/:id') //localhost:3000/usuarios/excluir/id
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('ADM', 'SUP')
  excluir(@Param('id') id: string) {
    return this.usuariosService.excluir(id);
  }

  @Patch('autorizar/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('ADM', 'SUP')
  autorizarUsuario(@Param('id') id: string) {
    return this.usuariosService.autorizaUsuario(id);
  }

  @Get('valida-usuario')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  validaUsuario(@UsuarioAtual() usuario: Usuario) {
    return this.usuariosService.validaUsuario(usuario.id);
  }

  @Get('buscar-novo')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Permissoes('ADM', 'SUP')
  buscarNovo(@Query('login') login: string) {
    return this.usuariosService.buscarNovo(login);
  }
}
