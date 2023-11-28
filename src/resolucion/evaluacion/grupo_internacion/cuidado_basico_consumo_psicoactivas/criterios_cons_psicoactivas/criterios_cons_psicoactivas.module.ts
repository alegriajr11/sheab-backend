import { Module } from '@nestjs/common';
import { CriteriosConsPsicoactivasService } from './criterios_cons_psicoactivas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriosConsPsicoactivasController } from './criterios_cons_psicoactivas.controller';
import { CriterioConsumoPsicoactivasEntity } from '../criterio_cuid_cons_psicoact.entity';
import { ConsumoPsicoactivasEntity } from '../cuid_consumo_psicoactivas.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CriterioConsumoPsicoactivasEntity, ConsumoPsicoactivasEntity]),
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
  controllers: [CriteriosConsPsicoactivasController],
  providers: [CriteriosConsPsicoactivasService],
  exports: [CriteriosConsPsicoactivasService]

})
export class CriteriosConsPsicoactivasModule { }
