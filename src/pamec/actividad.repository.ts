/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ActividadEntity } from "./actividad.entity";




@EntityRepository(ActividadEntity)
export class ActividadRepository extends Repository<ActividadEntity> {

}