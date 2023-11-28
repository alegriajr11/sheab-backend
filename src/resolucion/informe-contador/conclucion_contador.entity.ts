import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'conclusion_contador' })
export class ConclucionContadorEntity {
    @PrimaryGeneratedColumn('increment')
    con_id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: false })
    con_cumplimiento: string;
}