import { Module } from '@nestjs/common';
import { VerificacionService } from './verificacion.service';
import { VerificacionController } from './verificacion.controller';
import { ActaVerificacionEntity } from './acta-verificacion.entity';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatosVisitVErificadoEntity } from '../visita-verificacion/datos-visit-verificado.entity';
import { EvaluacionResVerificacionEntity } from 'src/resolucion/evaluacion/evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActaVerificacionEntity, PrestadorEntity, 
    DatosVisitVErificadoEntity, EvaluacionResVerificacionEntity, UsuarioEntity]),
    AuditoriaRegistroModule, AuditoriaActualizacionModule,
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
  providers: [VerificacionService],
  controllers: [VerificacionController]
})
export class VerificacionModule { }
