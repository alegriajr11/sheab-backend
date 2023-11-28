/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CriterioImplementacionEntity } from "./criterioimplementacion.entity";



@EntityRepository(CriterioImplementacionEntity)
export class CriterioImplemRepository extends Repository<CriterioImplementacionEntity> {

}