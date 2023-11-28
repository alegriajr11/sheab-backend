/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { RequestResetPasswordDTO } from './dto/request-reset-password.dto';
import { RessetPasswordDto } from './dto/reset-password.dto';
import { TokenDto } from './dto/token.dto';
import { RolDecorator } from 'src/decorators/rol.decorator';
import { RolNombre } from 'src/rol/rol.enum';
import { RolesGuard } from 'src/guards/rol.guard';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.authService.getall()
    }


    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('login')
    login(@Body() dto: LoginUsuarioDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    refresh(@Body() dto: TokenDto) {
        return this.authService.refresh(dto)
    }


    //REESTABLECER CONTRASEÑA
    @UseGuards(JwtAuthGuard)
    @Patch('request-reset-password/:id')
    requestResetPassword(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.authService.requestResetPassword(id);
    }



    @UseGuards(JwtAuthGuard)
    @Patch('reset-password')
    resetPassword(@Body() resetPasswordDto: RessetPasswordDto): Promise<void> {
        return this.authService.resetPassword(resetPasswordDto);
    }


    //CAMBIAR CONTRASEÑA
    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    changePassword(@Body() changePasswordDto: ChangePasswordDto, @GetUser() usuario: UsuarioEntity): Promise<void> {
        const a = 1
        return this.authService.changePassword(changePasswordDto, usuario)
    }

}
