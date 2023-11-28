import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicadorEntity } from 'src/sic/indicador.entity';
import { IndicadorController } from './indicador.controller';
import { IndicadorService } from './indicador.service';

@Module({
  imports: [TypeOrmModule.forFeature([IndicadorEntity])],
  controllers: [IndicadorController],
  providers: [IndicadorService]
})
export class IndicadorModule {}
