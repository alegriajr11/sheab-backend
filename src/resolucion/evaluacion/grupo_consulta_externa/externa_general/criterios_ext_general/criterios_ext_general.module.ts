/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CriteriosExtGeneralService } from './criterios_ext_general.service';
import { CriteriosExtGeneralController } from './criterios_ext_general.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioExternaGeneralEntity } from '../criterio_ext_general.entity';
import { ExternaGeneralEntity } from '../general.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioExternaGeneralEntity, ExternaGeneralEntity]),
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
    controllers: [CriteriosExtGeneralController],
    providers: [CriteriosExtGeneralService],
    exports: [CriteriosExtGeneralService]

})
export class CriteriosExtGeneralModule { }
