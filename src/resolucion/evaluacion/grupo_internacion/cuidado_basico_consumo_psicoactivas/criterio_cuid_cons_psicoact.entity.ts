/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ConsumoPsicoactivasEntity } from "./cuid_consumo_psicoactivas.entity";
import { SeccionEntity } from "../../seccion-apartado/seccion.entity";
import { ApartadoEntity } from "../../seccion-apartado/apartado.entity";
import { CumplimientoConsPsicoactivasEntity } from "./cumplimiento_cuid_cons_psicoact.entity";



@Entity({ name: 'criterio_cons_psicoactivas' })
export class CriterioConsumoPsicoactivasEntity {
    @PrimaryGeneratedColumn('increment')
    cri_cons_psic_id: number;
    
    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_cons_psic_modalidad: string;

    @Column({ type: 'varchar', length: 105, nullable: true, unique: false })
    cri_cons_psic_complejidad: string;

    @Column({ type: 'varchar', length: 10, nullable: true, unique: false })
    cri_cons_psic_articulo: string;

    @Column({ type: 'varchar', length: 700, nullable: true, unique: false })
    cri_cons_psic_nombre_criterio: string;


    //Relacion MUCHOS a UNO CRITERIOS_CUIDADO_BASICO_CONSUMO_PSICOACTIVAS - CUIDADO_BASICO_CONSUMO_PSICOACTIVAS (ESTANDARES)
    @ManyToOne(type => ConsumoPsicoactivasEntity,  cons_psicoactivas=> cons_psicoactivas.criterios_cons_psicoactivas)
    cons_psicoactivas: ConsumoPsicoactivasEntity;

    //RELACION ONTE TO ONE CRITERIOS CUIDADO_BASICO_CONSUMO_PSICOACTIVAS A CUMPLIMIENTO CUIDADO_BASICO_CONSUMO_PSICOACTIVAS
    @OneToOne(() => CumplimientoConsPsicoactivasEntity, cumplimiento => cumplimiento.criterio_cons_psico)
    cumplimiento: CumplimientoConsPsicoactivasEntity;

    //Relacion MUCHOS a UNO CRITERIOS CUIDADO_BASICO_CONSUMO_PSICOACTIVAS- SECCION
    @ManyToOne(type => SeccionEntity, seccion => seccion.seccion_cons_psico)
    cons_psico_seccion: SeccionEntity;

    //Relacion MUCHOS a UNO CRITERIOS CUIDADO_BASICO_CONSUMO_PSICOACTIVAS- APARTADO
    @ManyToOne(type => ApartadoEntity, apartado => apartado.apartado_cons_psico)
    cons_psico_apartado: ApartadoEntity;

}