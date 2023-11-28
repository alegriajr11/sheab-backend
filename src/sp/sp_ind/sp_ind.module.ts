import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioIndEntity } from './criterioind.entity';
import { EtapaInd } from './etapaind.entity';
import { SpIndController } from './sp_ind.controller';
import { SpIndService } from './sp_ind.service';
import { CriterioindModule } from './criterioind/criterioind.module';
import { CalificacionIndEntity } from './calificacionind.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { EvaluacionIndependientesEntity } from './evaluacion-independientes.entity';
import { CalificacionindModule } from './calificacionind/calificacionind.module';
import { EvaluacionIndModule } from './evaluacion-ind/evaluacion-ind.module';

@Module({
  imports:[TypeOrmModule.forFeature([EtapaInd,CriterioIndEntity,CalificacionIndEntity,EvaluacionIndependientesEntity]), TypeOrmModule.forFeature([CriterioIndEntity]), 
  CriterioindModule, AuditoriaRegistroModule,AuditoriaActualizacionModule,
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
  CalificacionindModule,
  EvaluacionIndModule, //FINAL DE MODULO JwtService
  ],
  providers: [SpIndService],
  controllers: [SpIndController]
})
export class SpIndModule {}
