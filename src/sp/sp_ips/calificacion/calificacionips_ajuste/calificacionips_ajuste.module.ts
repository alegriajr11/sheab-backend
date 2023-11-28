import { Module } from '@nestjs/common';
import { CalificacionipsAjusteService } from './calificacionips_ajuste.service';
import { CalificacionipsAjusteController } from './calificacionips_ajuste.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioAjusteEntity } from '../../criterioajuste.entity';
import { CalificacionAjusteIpsEntity } from '../../calificacionips_ajuste.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { EvaluacionipsEntity } from '../../evaluacionips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioAjusteEntity, CalificacionAjusteIpsEntity, EvaluacionipsEntity]),
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
  providers: [CalificacionipsAjusteService],
  controllers: [CalificacionipsAjusteController]
})
export class CalificacionipsAjusteModule {}
