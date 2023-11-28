import { Module } from '@nestjs/common';
import { CriterioImgRadIonizantesService } from './criterio_img_rad_ionizantes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioImgRadIonizantesEntity } from '../criterio_img_rad_ionizantes.entity';
import { ImgRadIonizantesEntity } from '../img_rad_ionizantes.entity';
import { CriterioImgRadIonizantesController } from './criterio_img_rad_ionizantes.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioImgRadIonizantesEntity, ImgRadIonizantesEntity]),
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
  controllers: [CriterioImgRadIonizantesController],
  providers: [CriterioImgRadIonizantesService],
  exports: [CriterioImgRadIonizantesService]
})
export class CriterioImgRadIonizantesModule { }



