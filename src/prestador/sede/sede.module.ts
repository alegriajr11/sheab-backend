import { Module } from '@nestjs/common';
import { SedeService } from './sede.service';
import { SedeController } from './sede.controller';
import { PrestadorEntity } from '../prestador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SedeEntity } from './sede.entity';
import { SedeMunicipioEntity } from './sede_municipio/sede-municipio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrestadorEntity,SedeEntity,SedeMunicipioEntity])],
  providers: [SedeService],
  controllers: [SedeController]
})
export class SedeModule {}
