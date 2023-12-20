/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CriterioEspecializadaEntity } from "./criterio_especializada.entity";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";


// import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";



@Entity({ name: 'externa_especializada' })
export class ExternaEspecializadaEntity {
    @PrimaryGeneratedColumn('increment')
    exte_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    exte_nombre_estandar: string;

    //Relacion UNO a MUCHOS EXTERNA_ESPECIALIZADA (ESTANDARES) - CRITERIOS_CONSULTA_EXTERNA_ESPECIALIZADA
    @OneToMany(type => CriterioEspecializadaEntity, cri_ext_especializada => cri_ext_especializada.externa_especializada)
    criterios_externa_especializada: CriterioEspecializadaEntity;

    //RELACION MUCHOS A UNO DE EXTERNA_ESPECIALIZADA CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_ext_especializada)
    ext_especializada_estan_servicios: ServicioEntity;

}
