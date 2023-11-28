import { Module } from '@nestjs/common';
import { CriteriosTomMuestrasService } from './criterios_tom_muestras.service';
import { CriteriosTomMuestrasController } from './criterios_tom_muestras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioMuestraLabClinicoEntity } from '../criterio_tom_muestras.entity';
import { MuestrasLabClinicoEntity } from '../tom_muestras.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioMuestraLabClinicoEntity, MuestrasLabClinicoEntity]),
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
  controllers: [CriteriosTomMuestrasController],
  providers: [CriteriosTomMuestrasService],
  exports: [CriteriosTomMuestrasService]

})
export class CriteriosTomMuestrasModule { }
