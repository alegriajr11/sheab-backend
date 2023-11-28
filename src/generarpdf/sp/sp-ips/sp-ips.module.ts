import { Module } from '@nestjs/common';
import { SpIpsService } from './sp-ips.service';
import { SpIpsController } from './sp-ips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActaSpIpsEntity } from './sp-ips.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { EvaluacionipsEntity } from 'src/sp/sp_ips/evaluacionips.entity';
import { CalificacionipsAjusteService } from 'src/sp/sp_ips/calificacion/calificacionips_ajuste/calificacionips_ajuste.service';
import { CriterioAjusteEntity } from 'src/sp/sp_ips/criterioajuste.entity';
import { CalificacionAjusteIpsEntity } from 'src/sp/sp_ips/calificacionips_ajuste.entity';
import { CalificacionipsImplementacionService } from 'src/sp/sp_ips/calificacion/calificacionips_implementacion/calificacionips_implementacion.service';
import { CalificacionipsPlaneacionService } from 'src/sp/sp_ips/calificacion/calificacionips_planeacion/calificacionips_planeacion.service';
import { CalificacionipsVerificacionService } from 'src/sp/sp_ips/calificacion/calificacionips_verificacion/calificacionips_verificacion.service';
import { CriterioImplementacionEntity } from 'src/sp/sp_ips/criterioimplementacion.entity';
import { CriterioPlaneacionEntity } from 'src/sp/sp_ips/criterioplaneacion.entity';
import { CriterioVerificacionEntity } from 'src/sp/sp_ips/criterioverificacion.entity';
import { CalificacionImplementacionIpsEntity } from 'src/sp/sp_ips/calificacionips_implementacion.entity';
import { CalificacionPlaneacionIpsEntity } from 'src/sp/sp_ips/calificacionips_planeacion.entity';
import { CalificacionVerificacionIpsEntity } from 'src/sp/sp_ips/calificacionips_verificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActaSpIpsEntity,EvaluacionipsEntity,CalificacionImplementacionIpsEntity,CalificacionPlaneacionIpsEntity,CalificacionVerificacionIpsEntity,CriterioAjusteEntity,CalificacionAjusteIpsEntity,CriterioImplementacionEntity,CriterioPlaneacionEntity,CriterioVerificacionEntity]),
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
}),
],
  providers: [SpIpsService,CalificacionipsAjusteService,CalificacionipsImplementacionService,CalificacionipsPlaneacionService,CalificacionipsVerificacionService],
  controllers: [SpIpsController]
})
export class SpIpsModule {}
