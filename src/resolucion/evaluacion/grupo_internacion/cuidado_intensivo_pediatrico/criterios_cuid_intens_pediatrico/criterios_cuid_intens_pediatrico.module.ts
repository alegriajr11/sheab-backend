import { Module } from '@nestjs/common';
import { CriteriosCuidIntensPediatricoService } from './criterios_cuid_intens_pediatrico.service';
import { CriteriosCuidIntensPediatricoController } from './criterios_cuid_intens_pediatrico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidIntePediatricoEntity } from '../criterio_cuid_intens_pediatrico.entity';
import { CuidIntePediatricoEntity } from '../cuid_intens_pediatrico.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioCuidIntePediatricoEntity, CuidIntePediatricoEntity]),
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
    controllers: [CriteriosCuidIntensPediatricoController],
    providers: [CriteriosCuidIntensPediatricoService],
    exports: [CriteriosCuidIntensPediatricoService]

})
export class CriteriosCuidIntensPediatricoModule { }
