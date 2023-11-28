import { Module } from '@nestjs/common';
import { CalificacionpamecController } from './calificacionpamec.controller';
import { CalificacionpamecService } from './calificacionpamec.service';
import { ActividadEntity } from '../actividad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { CalificacionpamEntity } from '../calificacionpam.entity';
import { CriteriopamEntity } from '../criteriopam.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { EvaluacionPamecEntity } from '../evaluacion-pamec.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrestadorEntity,ActividadEntity,CalificacionpamEntity, CriteriopamEntity,EvaluacionPamecEntity,
  ]),
  AuditoriaRegistroModule, AuditoriaActualizacionModule, AuditoriaEliminacionModule,
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
  controllers: [CalificacionpamecController],
  providers: [CalificacionpamecService],
  exports: [CalificacionpamecService]
})
export class CalificacionpamecModule {}
