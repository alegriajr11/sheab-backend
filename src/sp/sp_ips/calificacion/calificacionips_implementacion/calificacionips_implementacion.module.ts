import { Module } from '@nestjs/common';
import { CalificacionipsImplementacionService } from './calificacionips_implementacion.service';
import { CalificacionipsImplementacionController } from './calificacionips_implementacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionImplementacionIpsEntity } from '../../calificacionips_implementacion.entity';
import { CriterioImplementacionEntity } from '../../criterioimplementacion.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { EvaluacionipsEntity } from '../../evaluacionips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioImplementacionEntity, CalificacionImplementacionIpsEntity, EvaluacionipsEntity]),
  AuditoriaRegistroModule,AuditoriaActualizacionModule, AuditoriaEliminacionModule,
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
  providers: [CalificacionipsImplementacionService],
  controllers: [CalificacionipsImplementacionController]
})
export class CalificacionipsImplementacionModule {}
