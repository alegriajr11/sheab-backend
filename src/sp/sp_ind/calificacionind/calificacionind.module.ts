import { Module } from '@nestjs/common';
import { CalificacionindService } from './calificacionind.service';
import { CalificacionindController } from './calificacionind.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioIndEntity } from '../criterioind.entity';
import { CalificacionIndEntity } from '../calificacionind.entity';
import { EvaluacionIndependientesEntity } from '../evaluacion-independientes.entity';
import { EtapaInd } from '../etapaind.entity';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioIndEntity, EvaluacionIndependientesEntity, CalificacionIndEntity, EtapaInd]),
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
  }), //FINAL DE MODULO JwtService
  ],
  
  providers: [CalificacionindService],
  controllers: [CalificacionindController]
})
export class CalificacionindModule {


}
