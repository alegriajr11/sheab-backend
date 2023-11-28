import { Module } from '@nestjs/common';
import { CriteriosLabHistotecnologiaService } from './criterios_lab_histotecnologia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioLabHistotecnologiaEntity } from '../criterio_lab_histotec.entity';
import { LabHistotecnologiaEntity } from '../lab_histotecnologia.entity';
import { CriteriosLabHistotecnologiaController } from './criterios_lab_histotecnologia.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioLabHistotecnologiaEntity, LabHistotecnologiaEntity]),
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
  }),],
  controllers: [CriteriosLabHistotecnologiaController],
  providers: [CriteriosLabHistotecnologiaService],
  exports: [CriteriosLabHistotecnologiaService]
})
export class CriteriosLabHistotecnologiaModule { }
