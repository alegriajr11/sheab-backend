import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CapacidadInstaladaEntity } from '../capacidad_instalada.entity';
import { CapacidadInstaladaRepository } from '../capacidad_instalada.repository';
import { PrestadorEntity } from 'src/prestador/prestador.entity';
import { PrestadorRepository } from 'src/prestador/prestador.repository';
import { MessageDto } from 'src/common/message.dto';
import { CapacidadInstaladaDto } from 'src/resolucion/dtos/servicios_capacidad_dto/capacidad_instalada.dto';

@Injectable()
export class CapacidadInstaladaService {
    constructor(
        @InjectRepository(CapacidadInstaladaEntity)
        private readonly capacidadInstaladaRepository: CapacidadInstaladaRepository,
        @InjectRepository(PrestadorEntity)
        private readonly prestadorRepository: PrestadorRepository,
    ) { }

    //LISTANDO CAPACIDAD POR PRESTADOR
async getServicioForPrestador(id: string): Promise<CapacidadInstaladaEntity[]> {
    const servicio_prestador = await this.capacidadInstaladaRepository.createQueryBuilder('servicio')
    .select(['servicio', 'prestadores.pre_nombre'])
    .innerJoin('servicio.prestadores', 'prestadores')
    .where('prestadores.pre_cod_habilitacion = :servi_pres', { servi_pres : id})
    .getMany()
    if (!servicio_prestador) throw new NotFoundException(new MessageDto('No Existe en la lista'))
    return servicio_prestador
}

//METODO AGREGAR CASPACIDAD
async create(pre_cod_habilitacion: string, dto: CapacidadInstaladaDto): Promise<any> {
    const servicio_prestador = await this.prestadorRepository.findOne({ where: { pre_cod_habilitacion: pre_cod_habilitacion} });
    if (!servicio_prestador) throw new InternalServerErrorException(new MessageDto('El Prestador no ha sido creado'))
    //CREAMOS EL DTO PARA TRANSFERIR LOS DATOS
    const capacidadInstalada = this.capacidadInstaladaRepository.create(dto)
    //ASIGNAMOS EL PRESTADOR AL SERVICIO
    capacidadInstalada.prestadores = servicio_prestador
    //GUARDAR LOS DATOS EN LA BD
    await this.capacidadInstaladaRepository.save(capacidadInstalada)
    return new MessageDto('La capacidad ha sido Creada Correctamente');
}

//ENCONTRAR POR ID - CAPACIDAD INSTALADA
async findById(cap_id: number): Promise<CapacidadInstaladaEntity> {
    const capa_instalada = await this.capacidadInstaladaRepository.findOne({ where: { cap_id } });
    if (!capa_instalada) {
        throw new NotFoundException(new MessageDto('La capacidad No Existe'));
    }
    return capa_instalada;
}

//ELIMINAR CRITERIO DIAGNOSTICO VASCULAR
async delete(id: number): Promise<any> {
    const capa_instalada = await this.findById(id);
    await this.capacidadInstaladaRepository.delete(capa_instalada.cap_id)
    return new MessageDto(`Capacidad Eliminado`);
}

//ACTUALIZAR CRITERIOS DIAGNOSTICO VASCULAR
async updateCapacidad(id: number, dto: CapacidadInstaladaDto): Promise<any> {
    const capacidad_instalada = await this.findById(id);
    if (!capacidad_instalada) {
        throw new NotFoundException(new MessageDto('La capacidad no existe'))
    }
    dto.cap_grupo_nombre ? capacidad_instalada.cap_grupo_nombre = dto.cap_grupo_nombre : capacidad_instalada.cap_grupo_nombre = capacidad_instalada.cap_grupo_nombre;
    dto.cap_tipo ? capacidad_instalada.cap_tipo = dto.cap_tipo : capacidad_instalada.cap_tipo = capacidad_instalada.cap_tipo;
    dto.cap_num_placa ? capacidad_instalada.cap_num_placa = dto.cap_num_placa : capacidad_instalada.cap_num_placa = capacidad_instalada.cap_num_placa;
    dto.cap_movilidad ? capacidad_instalada.cap_movilidad = dto.cap_movilidad : capacidad_instalada.cap_movilidad = capacidad_instalada.cap_movilidad;
    dto.cap_modelo ? capacidad_instalada.cap_modelo = dto.cap_modelo : capacidad_instalada.cap_modelo = capacidad_instalada.cap_modelo;
    dto.cap_tarjeta_propiedad ? capacidad_instalada.cap_tarjeta_propiedad = dto.cap_tarjeta_propiedad : capacidad_instalada.cap_tarjeta_propiedad = capacidad_instalada.cap_tarjeta_propiedad;

    await this.capacidadInstaladaRepository.save(capacidad_instalada);

    return new MessageDto(`La capacidad ha sido Actualizado`);

}
}
