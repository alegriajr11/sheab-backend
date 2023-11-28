import { Module } from '@nestjs/common';
import { CriteriosHospParcialService } from './criterios_hosp_parcial.service';
import { CriteriosHospParcialController } from './criterios_hosp_parcial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioHospitalizacionParcialEntity } from '../criterio_hosp_parcial.entity';
import { HospitalizacionParcialEntity } from '../hospitalizacion_parcial.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioHospitalizacionParcialEntity, HospitalizacionParcialEntity]),
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
  controllers: [CriteriosHospParcialController],
  providers: [CriteriosHospParcialService],
  exports: [CriteriosHospParcialService]

})
export class CriteriosHospParcialModule { }
