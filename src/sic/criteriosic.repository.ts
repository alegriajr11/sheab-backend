/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CriteriosicEntity } from "./criteriosic.entity";



@EntityRepository(CriteriosicEntity)
export class CriterioSicRepository extends Repository<CriteriosicEntity> {

}