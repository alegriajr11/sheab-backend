/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { EvaluacionSicEntity } from "./evaluacionsic.entity";


@EntityRepository(EvaluacionSicEntity)
export class EvaluacionsicRepository extends Repository<EvaluacionSicEntity> {

}