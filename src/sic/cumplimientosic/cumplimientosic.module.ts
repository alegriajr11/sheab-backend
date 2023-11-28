import { Module } from '@nestjs/common';
import { CumplimientosicService } from './cumplimientosic.service';
import { CumplimientosicController } from './cumplimientosic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriosicEntity } from '../criteriosic.entity';
import { CumplimientoSicEntity } from '../cumplimientosic.entity';
import { EvaluacionSicEntity } from '../evaluacionsic.entity';
import { IndicadorEntity } from '../indicador.entity';
import { CumplimientoEstandarSicEntity } from '../cumplimientoestandar.entity';
import { CriterioEstandarSicEntity } from '../criteriosEstandar.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([CriteriosicEntity, CumplimientoSicEntity,CriterioEstandarSicEntity,CumplimientoEstandarSicEntity, EvaluacionSicEntity,IndicadorEntity,CriteriosicEntity]),
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
  providers: [CumplimientosicService],
  controllers: [CumplimientosicController]
})
export class CumplimientosicModule {}
