import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioDiagnostVascularService } from './criterio_diagnost_vascular.service';
import { CriterioDiagnostVascularEntity } from '../criterio_diagnost_vascular.entity';
import { DiagnosticoVascularEntity } from '../diagnostico_vascular.entity';
import { CriterioDiagnostVascularController } from './criterio_diagnost_vascular.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';


@Module({
  imports: [TypeOrmModule.forFeature([CriterioDiagnostVascularEntity, DiagnosticoVascularEntity]),
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
  }), //FINAL DE MODULO JwtService
  ],
  controllers: [CriterioDiagnostVascularController],
  providers: [CriterioDiagnostVascularService],
  exports: [CriterioDiagnostVascularService]
})
export class CriterioDiagnostVascularModule { }
