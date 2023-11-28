import { Module } from '@nestjs/common';
import { CriteriosCuidInterPediatricoService } from './criterios_cuid_inter_pediatrico.service';
import { CriteriosCuidInterPediatricoController } from './criterios_cuid_inter_pediatrico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriterioCuidIntermPediatricoEntity } from '../criterio_cuid_inter_pediatrico.entity';
import { CuidIntermPediatricoEntity } from '../cuid_inter_pediatrico.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioCuidIntermPediatricoEntity, CuidIntermPediatricoEntity]),
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
    controllers: [CriteriosCuidInterPediatricoController],
    providers: [CriteriosCuidInterPediatricoService],
    exports: [CriteriosCuidInterPediatricoService]

})
export class CriteriosCuidInterPediatricoModule { }
