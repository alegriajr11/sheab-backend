/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CriterioTerapiasService } from './criterio_terapias.service';
import { TerapiasEntity } from '../terapias.entity';
import { CriterioRadioterapiaEntity } from '../../radioterapia/criterio_radioterapia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioTerapiasController } from './criterio_terapias.controller';
import { CriterioTerapiaEntity } from '../criterios_terapias.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioTerapiaEntity, TerapiasEntity]),
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
    controllers: [CriterioTerapiasController],
    providers: [CriterioTerapiasService],
    exports: [CriterioTerapiasService]

})
export class CriterioTerapiasModule { }
