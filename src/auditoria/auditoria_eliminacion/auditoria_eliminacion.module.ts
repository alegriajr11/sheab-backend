import { Module } from '@nestjs/common';
import { AuditoriaEliminacionService } from './auditoria_eliminacion.service';
import { AuditoriaEliminacionController } from './auditoria_eliminacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaRegistroEntity } from '../auditoria_registro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaRegistroEntity])],
  providers: [AuditoriaEliminacionService],
  controllers: [AuditoriaEliminacionController],
  exports: [AuditoriaEliminacionService]
})
export class AuditoriaEliminacionModule {}
