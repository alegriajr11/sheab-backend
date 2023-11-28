import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'tecnico_administrativa' })
export class TecnicoAdministrativaEntity {
    @PrimaryGeneratedColumn('increment')
    tec_id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
    tec_administracion_propia: string;
}