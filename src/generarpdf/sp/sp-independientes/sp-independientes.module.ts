import { Module } from '@nestjs/common';
import { SpIndependientesService } from './sp-independientes.service';
import { SpIndependientesController } from './sp-independientes.controller';
import { ActaSpIndependientePdfEntity } from './sp-ind-acta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EvaluacionIndependientesEntity } from 'src/sp/sp_ind/evaluacion-independientes.entity';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { EtapaInd } from 'src/sp/sp_ind/etapaind.entity';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { CalificacionindService } from 'src/sp/sp_ind/calificacionind/calificacionind.service';
import { CriterioIndEntity } from 'src/sp/sp_ind/criterioind.entity';
import { CalificacionIndEntity } from 'src/sp/sp_ind/calificacionind.entity';
import { EvaluacionIndService } from 'src/sp/sp_ind/evaluacion-ind/evaluacion-ind.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActaSpIndependientePdfEntity, EvaluacionIndependientesEntity,CriterioIndEntity,CalificacionIndEntity,  PrestadorEntity, EtapaInd]),
  AuditoriaRegistroModule,AuditoriaActualizacionModule,JwtModule,
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
  providers: [SpIndependientesService,CalificacionindService,EvaluacionIndService],
  controllers: [SpIndependientesController]
})
export class SpIndependientesModule {}
