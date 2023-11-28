import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { CriterioEstandarSicEntity } from '../criteriosEstandar.entity';
import { CriteriosicEntity } from '../criteriosic.entity';
import { CumplimientoEstandarSicEntity } from '../cumplimientoestandar.entity';
import { CumplimientoSicEntity } from '../cumplimientosic.entity';
import { DominioEntity } from '../dominio.entity';
import { IndicadorEntity } from '../indicador.entity';
import { CriteriosicCumplimientoController } from './criteriosic-cumplimiento.controller';
import { CriteriosicCumplimientoService } from './criteriosic-cumplimiento.service';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';

@Module({
  imports: [TypeOrmModule.forFeature([PrestadorEntity, DominioEntity, IndicadorEntity, CriteriosicEntity, CumplimientoSicEntity, CriterioEstandarSicEntity, CumplimientoEstandarSicEntity, EvaluacionSicEntity]),
    AuditoriaRegistroModule,
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

  providers: [CriteriosicCumplimientoService],
  controllers: [CriteriosicCumplimientoController],
  exports: [CriteriosicCumplimientoService]
})
export class CriteriosicCumplimientoModule { }
