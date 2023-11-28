/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ClasificacionEntity } from "./clasificacion.entity";


@EntityRepository(ClasificacionEntity)
export class ClasificacionRepository extends Repository<ClasificacionEntity> {

}