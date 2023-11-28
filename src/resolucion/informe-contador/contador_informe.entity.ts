import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'contador_informe' })
export class ContadorInformeEntity {
    @PrimaryGeneratedColumn('increment')
    cont_id: number;

    @Column({ type: 'varchar', length: 20, nullable: false, unique: false })
    cont_fecha_corte: string;
    
    @Column({ type: 'varchar', length: 700 , nullable: false, unique: false })
    cont_descripcion: string;
    
    @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
    cont_verfi_obligacion_mercantil: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
    cont_obligacion_mercantil: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
    cont_obligacion_laboral: string;


}