import { Module } from '@nestjs/common';
import { GenerarExcelService } from './generar_excel.service';
import { GenerarExcelController } from './generar_excel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { RolEntity } from 'src/rol/rol.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtModule } from '@nestjs/jwt';
import { AuditoriaRegistroModule } from 'src/auditoria/auditoria_registro/auditoria_registro.module';
import { AuditoriaActualizacionModule } from 'src/auditoria/auditoria_actualizacion/auditoria_actualizacion.module';
import { AuditoriaEliminacionModule } from 'src/auditoria/auditoria_eliminacion/auditoria_eliminacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity,RolEntity]),JwtModule,
  AuditoriaRegistroModule,AuditoriaActualizacionModule,AuditoriaEliminacionModule,
 ],
  providers: [GenerarExcelService,UsuarioService],
  controllers: [GenerarExcelController]
})
export class GenerarExcelModule {}
