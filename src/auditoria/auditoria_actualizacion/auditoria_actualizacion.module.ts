import { Module } from '@nestjs/common';
import { AuditoriaActualizacionService } from './auditoria_actualizacion.service';
import { AuditoriaActualizacionController } from './auditoria_actualizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaRegistroEntity } from '../auditoria_registro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaRegistroEntity])],
  providers: [AuditoriaActualizacionService],
  controllers: [AuditoriaActualizacionController],
  exports: [AuditoriaActualizacionService]
})
export class AuditoriaActualizacionModule {}
