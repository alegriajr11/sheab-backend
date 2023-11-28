/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CriterioPlaneacionEntity } from "./criterioplaneacion.entity";


@EntityRepository(CriterioPlaneacionEntity)
export class CriterioPlaneacionRepository extends Repository<CriterioPlaneacionEntity> {

}