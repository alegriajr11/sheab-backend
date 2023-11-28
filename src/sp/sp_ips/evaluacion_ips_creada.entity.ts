/* eslint-disable prettier/prettier */

import { ActaSpIpsEntity } from "src/generarpdf/sp/sp-ips/sp-ips.entity";
import { PrestadorEntity } from "src/prestador/prestador.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";

@Entity({ name: 'evaluacionips_creadas' })
export class EvaluacionipsCreadasEntity {

	@PrimaryGeneratedColumn('increment')
	evips_id: number;

	@Column({ type: 'date', nullable: true })
	evips_creado: Date | null;

	//Relacion MUCHOS a UNO EVALUACIONIPS - PRESTADOR
	@ManyToOne(type => PrestadorEntity, prestador => prestador.prestator_eval_ips)
	eval_ips_prestator: PrestadorEntity;

	//Relacion UNO a UNO EVALUACION SP IPS - ACTAS SP IPS
	@OneToOne(() => ActaSpIpsEntity, actaIps => actaIps.act_eval_ips)
	@JoinColumn()
	eval_acta_spips: ActaSpIpsEntity;


}