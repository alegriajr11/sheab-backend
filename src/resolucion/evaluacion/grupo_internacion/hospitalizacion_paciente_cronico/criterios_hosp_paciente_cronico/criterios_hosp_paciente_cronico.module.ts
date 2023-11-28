import { Module } from '@nestjs/common';
import { CriteriosHospPacienteCronicoService } from './criterios_hosp_paciente_cronico.service';
import { CriteriosHospPacienteCronicoController } from './criterios_hosp_paciente_cronico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioHospitCronicoEntity } from '../criterio_hosp_paciente_cron.entity';
import { HospitalizacionCronicoEntity } from '../hospi_paciente_cronico.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioHospitCronicoEntity, HospitalizacionCronicoEntity]),
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
  controllers: [CriteriosHospPacienteCronicoController],
  providers: [CriteriosHospPacienteCronicoService],
  exports: [CriteriosHospPacienteCronicoService]

})
export class CriteriosHospPacienteCronicoModule { }
