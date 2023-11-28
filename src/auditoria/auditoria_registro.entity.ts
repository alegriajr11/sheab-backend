import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity({ name: 'auditoria-registro' })
export class AuditoriaRegistroEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usu_nombre: string

    @Column()
    usu_apellido: string

    @Column()
    accion: string;

    @Column({type: 'text', nullable: false})
    detalles: string;

    @Column()
    direccionIp: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creadoEn: Date;
    
    @BeforeInsert()
    async setDate() {
        this.creadoEn = new Date(); // Esto captura la fecha y hora actuales en la aplicación
    }
    
    
}
