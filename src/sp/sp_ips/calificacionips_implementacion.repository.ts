/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CalificacionImplementacionIpsEntity } from "./calificacionips_implementacion.entity";




@EntityRepository(CalificacionImplementacionIpsEntity)
export class CalificacionIpsImplementacionRepository extends Repository<CalificacionImplementacionIpsEntity> {

}