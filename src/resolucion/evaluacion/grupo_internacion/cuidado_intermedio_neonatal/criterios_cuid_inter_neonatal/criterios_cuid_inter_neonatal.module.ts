import { Module } from '@nestjs/common';
import { CriteriosCuidInterNeonatalService } from './criterios_cuid_inter_neonatal.service';
import { CriteriosCuidInterNeonatalController } from './criterios_cuid_inter_neonatal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidIntermNeonatalEntity } from '../criterio_cuid_inter_neonatal.entity';
import { CuidIntermNeonatalEntity } from '../cuid_inter_neonatal.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioCuidIntermNeonatalEntity, CuidIntermNeonatalEntity]),
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
    controllers: [CriteriosCuidInterNeonatalController],
    providers: [CriteriosCuidInterNeonatalService],
    exports: [CriteriosCuidInterNeonatalService]

})
export class CriteriosCuidInterNeonatalModule { }
