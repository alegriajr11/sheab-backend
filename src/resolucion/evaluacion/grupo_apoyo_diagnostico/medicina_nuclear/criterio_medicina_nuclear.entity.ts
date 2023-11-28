/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MedNuclearEntity } from "./medicina_nuclear.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoMedNuclearEntity } from "./cumplimineto_medicina_nuclear.entity";



@Entity({ name: 'criterio_med_nuclear' })
export class CriterioMedicinaNuclearEntity {
    @PrimaryGeneratedColumn('increment')
    crimed_nucl_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crimed_nucl_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    crimed_nucl_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    crimed_nucl_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    crimed_nucl_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_MEDICINA_NUCLEAR - MEDICINA_NUCLEAR (ESTANDARES)
    @ManyToOne(type => MedNuclearEntity,  med_nuclear=> med_nuclear.criterios_med_nuclear)
    med_nuclear: MedNuclearEntity;

    //RELACION ONTE TO ONE CRITERIOS MEDICINA_NUCLEAR A CUMPLIMIENTO MEDICINA_NUCLEAR
    @OneToOne(() => CumplimientoMedNuclearEntity, cumplimiento => cumplimiento.criterio_med_nuclear)
    cumplimiento: CumplimientoMedNuclearEntity;

    //Relacion MUCHOS a UNO CRITERIOS MEDICINA_NUCLEAR - SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_med_nuclear)
    med_nuclear_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS MEDICINA_NUCLEAR - APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_med_nuclear)
    med_nuclear_apartado: ApartadoEntity;


}