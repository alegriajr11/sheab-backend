import { Module } from '@nestjs/common';
import { CapacidadInstaladaService } from './capacidad_instalada.service';
import { CapacidadInstaladaController } from './capacidad_instalada.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapacidadInstaladaEntity } from '../capacidad_instalada.entity';
import { PrestadorEntity } from 'src/prestador/prestador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CapacidadInstaladaEntity, PrestadorEntity])],
  providers: [CapacidadInstaladaService],
  controllers: [CapacidadInstaladaController],
  exports: [CapacidadInstaladaService]
})
export class CapacidadInstaladaModule {}
