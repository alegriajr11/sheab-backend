/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioConsumoPsicoactivasEntity } from "./criterio_cuid_cons_psicoact.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'consumo_psicoactivas' })
export class ConsumoPsicoactivasEntity {
    @PrimaryGeneratedColumn('increment')
    cons_psi_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    cons_psi_nombre_estandar: string;

    //Relacion UNO a MUCHOS CUIDADO_BASICO_CONSUMO_PSICOACTIVAS (ESTANDARES) - CRITERIOS_CUIDADO_BASICO_CONSUMO_PSICOACTIVAS
    @OneToMany(type => CriterioConsumoPsicoactivasEntity, cri_cons_psicoactivas => cri_cons_psicoactivas.cons_psicoactivas)
    criterios_cons_psicoactivas: CriterioConsumoPsicoactivasEntity;

    //RELACION MUCHOS A UNO DE CUIDADO_BASICO_CONSUMO_PSICOACTIVAS CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_cuidado_psicoactivas)
    cuidado_psicoactivas_estan_servicios: ServicioEntity;

}
