import { Module } from '@nestjs/common';
import { CriterioImgRadNoionizantesService } from './criterio_img_rad_noionizantes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioImgRadNoIonizantesEntity } from '../criterio_img_rad_noionizantes.entity';
import { ImgRadNoIonizantesEntity } from '../img_rad_noionizantes.entity';
import { CriterioImgRadNoionizantesController } from './criterio_img_rad_noionizantes.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioImgRadNoIonizantesEntity, ImgRadNoIonizantesEntity]),
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
  controllers: [CriterioImgRadNoionizantesController],
  providers: [CriterioImgRadNoionizantesService],
  exports: [CriterioImgRadNoionizantesService]
})
export class CriterioImgRadNoionizantesModule { }
