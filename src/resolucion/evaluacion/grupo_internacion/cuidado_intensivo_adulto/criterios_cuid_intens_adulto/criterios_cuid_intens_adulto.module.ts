import { Module } from '@nestjs/common';
import { CriteriosCuidIntensAdultoService } from './criterios_cuid_intens_adulto.service';
import { CriteriosCuidIntensAdultoController } from './criterios_cuid_intens_adulto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidIntensAdultoEntity } from '../criterio_cuid_intens_adulto.entity';
import { CuidIntAdultoEntity } from '../cuid_intens_adulto.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioCuidIntensAdultoEntity, CuidIntAdultoEntity]),
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
    controllers: [CriteriosCuidIntensAdultoController],
    providers: [CriteriosCuidIntensAdultoService],
    exports: [CriteriosCuidIntensAdultoService]
})
export class CriteriosCuidIntensAdultoModule { }