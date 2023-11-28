import { Module } from '@nestjs/common';
import { ControlarImagenesController } from './controlar_imagenes.controller';
import { ControlarImagenesService } from './controlar_imagenes.service';

@Module({
  controllers: [ControlarImagenesController],
  providers: [ControlarImagenesService]
})
export class ControlarImagenesModule {}
