import { Module } from '@nestjs/common';
import { RequisitosCondicionesHabilitacionService } from './requisitos_condiciones_habilitacion.service';
import { RequisitosCondicionesHabilitacionController } from './requisitos_condiciones_habilitacion.controller';
import { ConceptoResEntity } from './concepto_res.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConceptoResEntity])],
  providers: [RequisitosCondicionesHabilitacionService],
  controllers: [RequisitosCondicionesHabilitacionController]
})
export class RequisitosCondicionesHabilitacionModule {}
