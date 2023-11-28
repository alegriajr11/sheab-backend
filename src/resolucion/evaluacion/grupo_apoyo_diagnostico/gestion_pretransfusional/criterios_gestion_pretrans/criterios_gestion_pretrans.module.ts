import { Module } from '@nestjs/common';
import { CriteriosGestionPretransService } from './criterios_gestion_pretrans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioGestionPretransfusionalEntity } from '../criterio_gestion_pretrans.entity';
import { GestionPretransfusionalEntity } from '../gestion_pretrans.entity';
import { CriteriosGestionPretransController } from './criterios_gestion_pretrans.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioGestionPretransfusionalEntity, GestionPretransfusionalEntity]),
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
  controllers: [CriteriosGestionPretransController],
  providers: [CriteriosGestionPretransService],
  exports: [CriteriosGestionPretransService]
})
export class CriteriosGestionPretransModule { }
