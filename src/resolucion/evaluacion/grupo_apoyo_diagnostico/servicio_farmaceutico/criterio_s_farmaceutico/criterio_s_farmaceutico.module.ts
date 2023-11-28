import { Module } from '@nestjs/common';
import { CriterioSFarmaceuticoService } from './criterio_s_farmaceutico.service';
import { CriterioSFarmaceuticoController } from './criterio_s_farmaceutico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioSerFarmaceuticoEntity } from '../criterios_s_farmaceutico.entity';
import { ServFarmaceuticoEntity } from '../servicio_farmaceutico.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioSerFarmaceuticoEntity, ServFarmaceuticoEntity]),
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
  controllers: [CriterioSFarmaceuticoController],
  providers: [CriterioSFarmaceuticoService],
  exports: [CriterioSFarmaceuticoService]

})
export class CriterioSFarmaceuticoModule { }
