import { Module } from '@nestjs/common';
import { CriterioServiciosService } from './criterio_servicios.service';
import { CriterioServiciosController } from './criterio_servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criterio_servicios } from '../servicios/criterio_servicios.entity';
import { TodoServiciosEntity } from '../servicios/todos_servicios.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';

@Module({
    imports: [TypeOrmModule.forFeature([Criterio_servicios, TodoServiciosEntity]),
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
    controllers: [CriterioServiciosController],
    providers: [CriterioServiciosService],
    exports: [CriterioServiciosService]

})
export class CriterioServiciosModule { }
