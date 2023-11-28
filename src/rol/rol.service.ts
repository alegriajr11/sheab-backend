/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolEntity } from './rol.entity';
import { RolRepository } from './rol.repository';

@Injectable()
export class RolService {
    

    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository
        ){}

        async findById(rol_id: number): Promise<RolEntity> {
            const rol = await this.rolRepository.findOne({ where: { rol_id } });
            if (!rol) {
              throw new NotFoundException(new MessageDto('No Existe'));
            }
            return rol;
          }

        async getall(): Promise<RolEntity[]> {
            const roles = await this.rolRepository.find();
            if(!roles.length) throw new NotFoundException(new MessageDto('No hay roles en la lista'))
            return roles;
        }
        

        async create(dto: CreateRolDto): Promise<any> {
            const exists = await this.rolRepository.findOne({where: {rol_nombre: dto.rol_nombre }});

            if(exists) throw new BadRequestException(new MessageDto('ese rol ya existe'));
            await this.rolRepository.save(dto as RolEntity);
            return new MessageDto('Rol Creado');
        }

}
