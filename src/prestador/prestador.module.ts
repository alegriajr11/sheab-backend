/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrestadorService } from './prestador.service';
import { PrestadorController } from './prestador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestadorEntity } from './prestador.entity';
import { MunicipioEntity } from 'src/municipio/municipio.entity';
import { ClasificacionController } from './clasificacion/clasificacion.controller';
import { ClasificacionEntity } from './clasificacion/clasificacion.entity';
import { ClaseEntity } from './clase/clase.entity';
import { TipoEntity } from './tipo/tipo.entity';
import { ClaseService } from './clase/clase.service';
import { ClaseController } from './clase/clase.controller';
import { ClasificacionService } from './clasificacion/clasificacion.service';
import { TipoService } from './tipo/tipo.service';
import { TipoController } from './tipo/tipo.controller';
import { SedeModule } from './sede/sede.module';

@Module({
  imports: [TypeOrmModule.forFeature([PrestadorEntity, MunicipioEntity, ClasificacionEntity, ClaseEntity, TipoEntity]), SedeModule],
  providers: [PrestadorService, ClaseService, ClasificacionService, TipoService],
  controllers: [PrestadorController, ClasificacionController, ClaseController, TipoController],
})
export class PrestadorModule {}
