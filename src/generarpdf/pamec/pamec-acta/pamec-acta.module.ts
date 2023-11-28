import { Module } from '@nestjs/common';
import { PamecActaService } from './pamec-acta.service';
import { PamecActaController } from './pamec-acta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActaPamecEntity } from './pamec-acta.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { ActividadEntity } from 'src/pamec/actividad.entity';
import { EvaluacionPamecEntity } from 'src/pamec/evaluacion-pamec.entity';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { CriteriopamService } from 'src/pamec/actividad/criteriopam/criteriopam.service';
import { CriteriopamEntity } from 'src/pamec/criteriopam.entity';
import { CalificacionpamecService } from 'src/pamec/calificacionpamec/calificacionpamec.service';
import { CalificacionpamEntity } from 'src/pamec/calificacionpam.entity';
import { EvaluacionpamecService } from 'src/pamec/evaluacionpamec/evaluacionpamec.service';


@Module({
  imports: [TypeOrmModule.forFeature([ActaPamecEntity,PrestadorEntity,ActividadEntity,EvaluacionPamecEntity,CriteriopamEntity,CalificacionpamEntity]),
    AuditoriaRegistroModule,AuditoriaActualizacionModule,JwtModule,
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
  providers: [PamecActaService,CalificacionpamecService,EvaluacionpamecService],
  controllers: [PamecActaController]
})
export class PamecActaModule { }
