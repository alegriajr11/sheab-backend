/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CalificacionPlaneacionIpsEntity } from "./calificacionips_planeacion.entity";


@EntityRepository(CalificacionPlaneacionIpsEntity)
export class CalificacionIpsPlaneacionRepository extends Repository<CalificacionPlaneacionIpsEntity> {

}