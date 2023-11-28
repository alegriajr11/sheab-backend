import { Module } from '@nestjs/common';
import { SicActaService } from './sic-acta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SicActaController } from './sic-acta.controller';
import { ActaSicPdfEntity } from './sic-acta-pdf.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { EvaluacionSicEntity } from 'src/sic/evaluacionsic.entity';
import { DominioEntity } from 'src/sic/dominio.entity';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { CumplimientosicService } from 'src/sic/cumplimientosic/cumplimientosic.service';
import { CumplimientoSicEntity } from 'src/sic/cumplimientosic.entity';
import { CriteriosicEntity } from 'src/sic/criteriosic.entity';
import { IndicadorEntity } from 'src/sic/indicador.entity';
import { CumplimientoEstandarSicEntity } from 'src/sic/cumplimientoestandar.entity';



@Module({
  imports: [TypeOrmModule.forFeature([ActaSicPdfEntity, EvaluacionSicEntity, PrestadorEntity, DominioEntity,CumplimientoSicEntity,CumplimientoEstandarSicEntity,CriteriosicEntity,IndicadorEntity]),
  AuditoriaRegistroModule,AuditoriaActualizacionModule,
  //MODULO JwtService
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: 7200,
      },
    }),
    inject: [ConfigService],
  }), //FINAL DE MODULO JwtService
], 
  controllers: [SicActaController],
  providers: [SicActaService,CumplimientosicService]
})
export class SicActaModule {}
