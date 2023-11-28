import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from 'src/pamec/actividad.entity';
import { CriteriopamEntity } from 'src/pamec/criteriopam.entity';
import { CriteriopamController } from './criteriopam.controller';
import { CriteriopamService } from './criteriopam.service';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [CriteriopamController],
  providers: [CriteriopamService],
  imports: [CriteriopamModule, TypeOrmModule.forFeature([CriteriopamEntity]), TypeOrmModule.forFeature([ActividadEntity]),
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
]
})
export class CriteriopamModule {}
