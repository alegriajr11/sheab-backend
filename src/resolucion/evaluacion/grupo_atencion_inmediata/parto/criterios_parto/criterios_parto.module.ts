import { Module } from '@nestjs/common';
import { CriteriosPartoService } from './criterios_parto.service';
import { CriteriosPartoController } from './criterios_parto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioPartoEntity } from '../criterio_parto.entity';
import { PartoEntity } from '../parto.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({

    imports: [TypeOrmModule.forFeature([CriterioPartoEntity, PartoEntity]),
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
    controllers: [CriteriosPartoController],
    providers: [CriteriosPartoService],
    exports: [CriteriosPartoService]

})
export class CriteriosPartoModule { }
