/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipioController } from './municipio.controller';
import { MunicipioEntity } from './municipio.entity';
import { MunicipioService } from './municipio.service';

@Module({
    imports: [TypeOrmModule.forFeature([MunicipioEntity ])],
    providers: [MunicipioService],
    controllers: [MunicipioController]
})
export class MunicipioModule {}
