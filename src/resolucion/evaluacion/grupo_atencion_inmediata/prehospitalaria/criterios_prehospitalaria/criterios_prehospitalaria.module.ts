import { Module } from '@nestjs/common';
import { CriteriosPrehospitalariaService } from './criterios_prehospitalaria.service';
import { CriteriosPrehospitalariaController } from './criterios_prehospitalaria.controller';
import { CriterioPrehospitalariaEntity } from '../criterio_prehospitalaria.entity';
import { PrehospitalariaEntity } from '../prehospitalaria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
    imports: [TypeOrmModule.forFeature([CriterioPrehospitalariaEntity, PrehospitalariaEntity]),
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
    controllers: [CriteriosPrehospitalariaController],
    providers: [CriteriosPrehospitalariaService],
    exports: [CriteriosPrehospitalariaService]

})
export class CriteriosPrehospitalariaModule { }
