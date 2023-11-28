/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CriterioEstandarSicEntity } from "./criteriosEstandar.entity";




@EntityRepository(CriterioEstandarSicEntity)
export class CriterioEstandarSicRepository extends Repository<CriterioEstandarSicEntity> {

}