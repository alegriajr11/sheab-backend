/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioMedicinaNuclearEntity } from "./criterio_medicina_nuclear.entity";
import { ServicioEntity } from "src/resolucion/servicio/servicio.entity";





@Entity({ name: 'med_nuclear' })
export class MedNuclearEntity {
    @PrimaryGeneratedColumn('increment')
    med_nucl_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    med_nucl_nombre_estandar: string;

    //Relacion UNO a MUCHOS MEDICINA NUCLEAR (ESTANDARES) - CRITERIOS_MEDICINA_NUCLEAR
    @OneToMany(type => CriterioMedicinaNuclearEntity, cri_med_nuclear => cri_med_nuclear.med_nuclear)
    criterios_med_nuclear: CriterioMedicinaNuclearEntity;

    //RELACION MUCHOS A UNO DE MEDICINA NUCLEAR CON SERVICIOS 
    @ManyToOne(type => ServicioEntity, servicio => servicio.servicios_medi_nuclear)
    medi_nuclear_estan_servicios: ServicioEntity;


}
