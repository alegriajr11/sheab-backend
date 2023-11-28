/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { CriterioMedicinaNuclearEntity } from "./criterio_medicina_nuclear.entity";





@Entity({ name: 'med_nuclear' })
export class MedNuclearEntity {
    @PrimaryGeneratedColumn('increment')
    med_nucl_id: number;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    med_nucl_nombre_estandar: string;

    //Relacion UNO a MUCHOS MEDICINA NUCLEAR (ESTANDARES) - CRITERIOS_MEDICINA_NUCLEAR
    @OneToMany(type => CriterioMedicinaNuclearEntity, cri_med_nuclear => cri_med_nuclear.med_nuclear)
    criterios_med_nuclear: CriterioMedicinaNuclearEntity;

    //Relación MUCHOS a UNO MEDICINA_NUCLEAR - PRESTADOR
    // @ManyToOne(type => PrestadorEntity, prestador => prestador.med_nuclear)
    // prestador: PrestadorEntity

}
