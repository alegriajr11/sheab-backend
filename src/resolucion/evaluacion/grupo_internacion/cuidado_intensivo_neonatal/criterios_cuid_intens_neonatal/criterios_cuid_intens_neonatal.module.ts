import { Module } from '@nestjs/common';
import { CriteriosCuidIntensNeonatalService } from './criterios_cuid_intens_neonatal.service';
import { CriteriosCuidIntensNeonatalController } from './criterios_cuid_intens_neonatal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidInteNeonatalEntity } from '../criterio_cuid_intens_neonatal.entity';
import { CuidInteNeonatalEntity } from '../cuid_intens_neonatal.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioCuidInteNeonatalEntity, CuidInteNeonatalEntity]),
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
    controllers: [CriteriosCuidIntensNeonatalController],
    providers: [CriteriosCuidIntensNeonatalService],
    exports: [CriteriosCuidIntensNeonatalService]

})
export class CriteriosCuidIntensNeonatalModule { }
