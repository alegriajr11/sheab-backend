/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { RolEntity } from 'src/rol/rol.entity';
import { RolNombre } from 'src/rol/rol.enum';
import { RolRepository } from 'src/rol/rol.repository';
import { In, Like } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioRepository } from './usuario.repository';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/auth/payload.interface';
import { isEmpty } from 'class-validator';
import { AuditoriaEliminacionService } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.service';
import { AuditoriaActualizacionService } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.service';
import { NuevoUsuarioDto } from 'src/auth/dto/nuevo-usuario.dto';
import { use } from 'passport';
import { AuditoriaRegistroService } from 'src/auditoria/auditoria_registro/auditoria_registro.service';


@Injectable()
export class UsuarioService {

  constructor(

    @InjectRepository(RolEntity)
    private readonly rolRepository: RolRepository,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: UsuarioRepository,
    private readonly jwtService: JwtService,
    private readonly auditoria_registro_services: AuditoriaRegistroService,
    private readonly auditoria_actualizacion_services: AuditoriaActualizacionService,
    private readonly auditoria_eliminacion_services: AuditoriaEliminacionService
  ) { }

  /*LISTANDO USUARIO POR ID*/
  async findById(usu_id: number): Promise<UsuarioEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { usu_id } });
    if (!usuario) {
      throw new NotFoundException(new MessageDto('No Existe'));
    }
    return usuario;
  }


  /*LISTANDO TODOS LOS USUARIOS */
  async getall(): Promise<UsuarioEntity[]> {
    const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
      .select(['usuario', 'roles.rol_nombre'])
      .innerJoin('usuario.roles', 'roles')
      .getMany()
    if (!usuario.length) throw new NotFoundException(new MessageDto('No hay Usuarios en la lista'))
    return usuario
  }

  /*LISTANDO USUARIOS SIN ADMIN, SIN CONTADOR Y SOLO ACTIVOS*/
  async getallUsersRol(rol_nombre: string): Promise<UsuarioEntity[]> {
    if (rol_nombre === 'sic') {
      const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
        .select(['usuario', 'roles.rol_nombre'])
        .innerJoin('usuario.roles', 'roles')
        .where('roles.rol_nombre IN (:rol)', { rol: ['sic'] })
        .andWhere('usuario.usu_estado LIKE :estado', { estado: '%true%' })
        .getMany()
      if (!usuario.length) throw new NotFoundException(new MessageDto('No hay Usuarios en la lista'))
      return usuario

    } else if (rol_nombre === 'sp') {
      const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
        .select(['usuario', 'roles.rol_nombre'])
        .innerJoin('usuario.roles', 'roles')
        .where('roles.rol_nombre IN (:rol)', { rol: ['sp'] })
        .andWhere('usuario.usu_estado LIKE :estado', { estado: '%true%' })
        .getMany()
      if (!usuario.length) throw new NotFoundException(new MessageDto('No hay Usuarios en la lista'))
      return usuario

    } else if (rol_nombre === 'pamec') {
      const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
        .select(['usuario', 'roles.rol_nombre'])
        .innerJoin('usuario.roles', 'roles')
        .where('roles.rol_nombre IN (:rol)', { rol: ['pamec'] })
        .andWhere('usuario.usu_estado LIKE :estado', { estado: '%true%' })
        .getMany()
      if (!usuario.length) throw new NotFoundException(new MessageDto('No hay Usuarios en la lista'))
      return usuario

    } else if (rol_nombre === 'res') {
      const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
        .select(['usuario', 'roles.rol_nombre'])
        .innerJoin('usuario.roles', 'roles')
        .where('roles.rol_nombre IN (:rol)', { rol: ['res'] })
        .andWhere('usuario.usu_estado LIKE :estado', { estado: '%true%' })
        .getMany()
      if (!usuario.length) throw new NotFoundException(new MessageDto('No hay Usuarios en la lista'))
      return usuario
    }

  }



  /*LISTANDO USUARIOS SOLO CON ROL CONTADOR Y QUE ESTEN ACTIVOS*/
  async getallUserContador(): Promise<UsuarioEntity[]> {
    const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
      .select(['usuario', 'roles.rol_nombre'])
      .innerJoin('usuario.roles', 'roles')
      .where('roles.rol_id IN (:rol)', { rol: ['6'] })
      .andWhere('usuario.usu_estado LIKE :estado', { estado: '%true%' })
      .getMany()
    if (!usuario.length) throw new NotFoundException(new MessageDto('No hay Usuarios en la lista'))
    return usuario
  }

  /*CREACIÓN USUARIO ADMINISTRADOR */
  async create(payloads: { dto: NuevoUsuarioDto, tokenDto: TokenDto }): Promise<any> {
    const { dto, tokenDto } = payloads;
    const { usu_nombreUsuario, usu_email, usu_cedula } = dto;
    const exists = await this.usuarioRepository.findOne({ where: [{ usu_nombreUsuario: usu_nombreUsuario }, { usu_email: usu_email }, { usu_cedula: usu_cedula }] });
    if (exists) throw new BadRequestException(new MessageDto('Ese usuario ya existe'));
    const rolAdmin = await this.rolRepository.findOne({ where: { rol_nombre: RolNombre.ADMIN } });
    if (!rolAdmin) throw new InternalServerErrorException(new MessageDto('los roles aún no han sido creados'))
    const admin = this.usuarioRepository.create(dto);

    admin.roles = [rolAdmin];
    await this.usuarioRepository.save(admin)
    const usuario = await this.jwtService.decode(tokenDto.token);

    const payloadInterface: PayloadInterface = {
      usu_id: usuario[`usu_id`],
      usu_nombre: usuario[`usu_nombre`],
      usu_apellido: usuario[`usu_apellido`],
      usu_nombreUsuario: usuario[`usu_nombreUsuario`],
      usu_email: usuario[`usu_email`],
      usu_estado: usuario[`usu_estado`],
      usu_roles: usuario[`usu_roles`]
    };


    await this.usuarioRepository.save(admin);
    await this.auditoria_registro_services.logCreateUserAdmin(
      payloadInterface.usu_nombre,
      payloadInterface.usu_apellido,
      'ip',
      dto.usu_nombre,
      dto.usu_nombreUsuario
    );

    return new MessageDto('Admin Creado');
  }

  async createUserRol(payloads: { dto: NuevoUsuarioDto, rolesIds: number[], tokenDto: TokenDto }): Promise<any> {
    const { dto, tokenDto, rolesIds } = payloads;
    const { usu_nombreUsuario, usu_email, usu_cedula } = dto;
    // Verificar si el usuario ya existe
    const exists = await this.usuarioRepository.findOne({ where: [{ usu_nombreUsuario: usu_nombreUsuario }, { usu_email: usu_email }, { usu_cedula: usu_cedula }] });
    if (exists) {
      throw new BadRequestException(new MessageDto('Ese usuario ya existe'));
    }
    // Crear el nuevo usuario DTO
    const user = this.usuarioRepository.create(dto);

    //ASIGNACIÓN DE ROLES
    const roles = await this.rolRepository.findByIds(rolesIds)
    user.roles = roles

    await this.usuarioRepository.save(user)
    const usuario = await this.jwtService.decode(tokenDto.token);

    const payloadInterface: PayloadInterface = {
      usu_id: usuario[`usu_id`],
      usu_nombre: usuario[`usu_nombre`],
      usu_apellido: usuario[`usu_apellido`],
      usu_nombreUsuario: usuario[`usu_nombreUsuario`],
      usu_email: usuario[`usu_email`],
      usu_estado: usuario[`usu_estado`],
      usu_roles: usuario[`usu_roles`]
    };

    // await this.auditoria_registro_services.logCreateUser(
    //   payloadInterface.usu_nombre,
    //   payloadInterface.usu_apellido,
    //   'ip',
    //   dto.usu_nombre,
    //   dto.usu_nombreUsuario
    // );
    return new MessageDto('Usuario Creado');
  }



  /*ACTUALIZANDO USUARIO*/
  async update(id: number, payload: { dto: UsuarioDto, tokenDto: TokenDto }): Promise<any> {
    const { dto, tokenDto } = payload;
    const usuario_actualizar = await this.findById(id);

    let rol_usuario

    if (!usuario_actualizar)
      throw new NotFoundException(new MessageDto('El Usuario No Existe'));

    // Asignación condicional para actualizar los valores solo si están presentes en el DTO.
    usuario_actualizar.usu_nombre = dto.usu_nombre ?? usuario_actualizar.usu_nombre;
    usuario_actualizar.usu_apellido = dto.usu_apellido ?? usuario_actualizar.usu_apellido;
    usuario_actualizar.usu_nombreUsuario = dto.usu_nombreUsuario ?? usuario_actualizar.usu_nombreUsuario;
    usuario_actualizar.usu_estado = dto.usu_estado ?? usuario_actualizar.usu_estado;
    usuario_actualizar.usu_cargo = dto.usu_cargo ?? usuario_actualizar.usu_cargo;
    usuario_actualizar.usu_area_profesional = dto.usu_area_profesional ?? usuario_actualizar.usu_area_profesional;
    usuario_actualizar.usu_firma = dto.usu_firma ?? usuario_actualizar.usu_firma

    // Actualizar roles si se proporcionan en el DTO
    if (dto.roles && dto.roles.length > 0) {
      const roles = await this.rolRepository.findByIds(dto.roles);
      usuario_actualizar.roles = roles;
    }

    const usuario = await this.jwtService.decode(tokenDto.token);

    const payloadInterface: PayloadInterface = {
      usu_id: usuario[`usu_id`],
      usu_nombre: usuario[`usu_nombre`],
      usu_apellido: usuario[`usu_apellido`],
      usu_nombreUsuario: usuario[`usu_nombreUsuario`],
      usu_email: usuario[`usu_email`],
      usu_estado: usuario[`usu_estado`],
      usu_roles: usuario[`usu_roles`]
    };

    //SE MANDA A ACTUALIZAR LA ENTIDAD A LA BD
    await this.usuarioRepository.save(usuario_actualizar);

    //CONDICIONALES PARA TENER EL CUENTA EL ROL Y ASÍ LLAMAR EL METODO LOG QUE LE CORRESPONDA
    //PENDIENTE...........
    usuario_actualizar.roles.forEach(data => {
      rol_usuario = data.rol_nombre
    })
    switch (rol_usuario) {
      case 'ADMIN':
        await this.auditoria_actualizacion_services.logUpdateUserAdmin(
          payloadInterface.usu_nombre,
          payloadInterface.usu_apellido,
          'ip',
          dto.usu_nombre,
          dto.usu_nombreUsuario
        );
        break;

      case 'pamec':
        await this.auditoria_actualizacion_services.logUpdateUserPamec(
          payloadInterface.usu_nombre,
          payloadInterface.usu_apellido,
          'ip',
          dto.usu_nombre,
          dto.usu_nombreUsuario
        );
        break;

      case 'sp':
        await this.auditoria_actualizacion_services.logUpdateUserSp(
          payloadInterface.usu_nombre,
          payloadInterface.usu_apellido,
          'ip',
          dto.usu_nombre,
          dto.usu_nombreUsuario
        );
        break;
      case 'res':
        await this.auditoria_actualizacion_services.logUpdateUserRes(
          payloadInterface.usu_nombre,
          payloadInterface.usu_apellido,
          'ip',
          dto.usu_nombre,
          dto.usu_nombreUsuario
        );
        break;

      case 'SIC':
        await this.auditoria_actualizacion_services.logUpdateUserSic(
          payloadInterface.usu_nombre,
          payloadInterface.usu_apellido,
          'ip',
          dto.usu_nombre,
          dto.usu_nombreUsuario
        );
        break;

      default:
        new MessageDto(`Rol no encontrado`);
        break;
    }

    return new MessageDto(`Usuario Actualizado`);
  }

  async delete(id: number, tokenDto: TokenDto): Promise<MessageDto> {
    try {
      const usuario_eliminar = await this.findById(id);

      const usuario = await this.jwtService.decode(tokenDto.token);

      const payloadInterface: PayloadInterface = {
        usu_id: usuario[`usu_id`],
        usu_nombre: usuario[`usu_nombre`],
        usu_apellido: usuario[`usu_apellido`],
        usu_nombreUsuario: usuario[`usu_nombreUsuario`],
        usu_email: usuario[`usu_email`],
        usu_estado: usuario[`usu_estado`],
        usu_roles: usuario[`usu_roles`]
      };

      await this.usuarioRepository.delete(usuario_eliminar.usu_id);

      usuario_eliminar.roles.forEach(async (rol) => {
        switch (rol.rol_nombre) {
          case 'admin':
            await this.auditoria_eliminacion_services.logDeleteUserAdmin(
              payloadInterface.usu_nombre,
              payloadInterface.usu_apellido,
              'ip',
              usuario_eliminar.usu_nombre,
              usuario_eliminar.usu_nombreUsuario
            );
            break;

          case 'pamec':
            await this.auditoria_eliminacion_services.logDeleteUserPamec(
              payloadInterface.usu_nombre,
              payloadInterface.usu_apellido,
              'ip',
              usuario_eliminar.usu_nombre,
              usuario_eliminar.usu_nombreUsuario
            );
            break;

          case 'sp':
            await this.auditoria_eliminacion_services.logDeleteUserSp(
              payloadInterface.usu_nombre,
              payloadInterface.usu_apellido,
              'ip',
              usuario_eliminar.usu_nombre,
              usuario_eliminar.usu_nombreUsuario
            );
            break;

          case 'res':
            await this.auditoria_eliminacion_services.logDeleteUserRes(
              payloadInterface.usu_nombre,
              payloadInterface.usu_apellido,
              'ip',
              usuario_eliminar.usu_nombre,
              usuario_eliminar.usu_nombreUsuario
            );
            break;

          case 'sic':
            await this.auditoria_eliminacion_services.logDeleteUserSic(
              payloadInterface.usu_nombre,
              payloadInterface.usu_apellido,
              'ip',
              usuario_eliminar.usu_nombre,
              usuario_eliminar.usu_nombreUsuario
            );
            break;


          default:
            throw new Error(`Rol no encontrado`);
        }
      });

      return new MessageDto(`Usuario eliminado`);
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }


  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<UsuarioEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { resetPasswordToken } });
    if (!usuario) {
      throw new NotFoundException(new MessageDto('Error'));
    }
    return usuario;
  }

}
