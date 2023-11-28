import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'sistema_contable' })
export class SistemaContableEntity {
    @PrimaryGeneratedColumn('increment')
    sist_id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
    sist_profesional: string;
    
    @Column({ type: 'varchar', length: 15 , nullable: false, unique: false })
    sist_tarjeta_profesional: string;
    
    @Column({ type: 'varchar', length: 12, nullable: false, unique: false })
    sist_fecha_corte: string;



}