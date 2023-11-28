import { Module } from '@nestjs/common';
import { CriterioQuimioterapiaService } from './criterio_quimioterapia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioQuimioterapiaController } from './criterio_quimioterapia.controller';
import { CriterioQuimioterapiaEntity } from '../criterio_quimioterapia.entity';
import { QuimioterapiaEntity } from '../quimioterapia.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioQuimioterapiaEntity, QuimioterapiaEntity]),
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
  controllers: [CriterioQuimioterapiaController],
  providers: [CriterioQuimioterapiaService],
  exports: [CriterioQuimioterapiaService]

})
export class CriterioQuimioterapiaModule { }
