/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CalificacionVerificacionIpsEntity } from "./calificacionips_verificacion.entity";




@EntityRepository(CalificacionVerificacionIpsEntity)
export class CalificacionIpsVerificacionRepository extends Repository<CalificacionVerificacionIpsEntity> {

}