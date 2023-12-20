import { Module } from '@nestjs/common';
import { CumplimientoTodosServiciosService } from './cumplimiento_todos_servicios.service';
import { CumplimientoTodosServiciosController } from './cumplimiento_todos_servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criterio_servicios } from '../servicios/criterio_servicios.entity';
import { CumplimientoServiciosEntity } from '../servicios/cumplimiento_servicios.entity';
import { EvaluacionResVerificacionEntity } from '../../evaluacion_resolucion_verificacion/evaluacion_res.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';


@Module({
  imports: [TypeOrmModule.forFeature([Criterio_servicios, CumplimientoServiciosEntity, EvaluacionResVerificacionEntity]),
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
  exports: [CumplimientoTodosServiciosService],
  providers: [CumplimientoTodosServiciosService],
  controllers: [CumplimientoTodosServiciosController]
})
export class CumplimientoTodosServiciosModule {}
