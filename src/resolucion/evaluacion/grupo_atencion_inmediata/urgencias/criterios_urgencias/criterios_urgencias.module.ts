import { Module } from '@nestjs/common';
import { CriteriosUrgenciasService } from './criterios_urgencias.service';
import { CriteriosUrgenciasController } from './criterios_urgencias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioUrgenciasEntity } from '../criterio_urgencias.entity';
import { UrgenciasEntity } from '../urgencias.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioUrgenciasEntity, UrgenciasEntity]),
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
    controllers: [CriteriosUrgenciasController],
    providers: [CriteriosUrgenciasService],
    exports: [CriteriosUrgenciasService]

})
export class CriteriosUrgenciasModule { }
