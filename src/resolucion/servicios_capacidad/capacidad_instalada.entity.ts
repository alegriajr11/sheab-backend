import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'capacidad_instalada' })
export class CapacidadInstaladaEntity {
    @PrimaryGeneratedColumn('increment')
    cap_id: number;

    @Column({ type: 'varchar', length: 20, nullable: false, unique: false })
    cap_grupo_nombre: string;
    
    @Column({ type: 'varchar', length: 20, nullable: false, unique: false })
    cap_tipo: string;
    
    @Column({ type: 'varchar', length: 8, nullable: false, unique: false })
    cap_num_placa: string;

    @Column({ type: 'varchar', length: 15, nullable: false, unique: false })
    cap_movilidad: string;

    @Column({ type: 'varchar', length: 5, nullable: false, unique: false })
    cap_modelo: string;

    @Column({ type: 'varchar', length: 13, nullable: false, unique: false })
    cap_tarjeta_propiedad: string;



    @ManyToOne(type => PrestadorEntity, prestador => prestador.capacidad_instalada)
    prestadores: PrestadorEntity
}