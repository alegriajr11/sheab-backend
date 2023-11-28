/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CalificacionpamEntity } from "./calificacionpam.entity";


@EntityRepository(CalificacionpamEntity)
export class CalificacionPamRepository extends Repository<CalificacionpamEntity> {

}