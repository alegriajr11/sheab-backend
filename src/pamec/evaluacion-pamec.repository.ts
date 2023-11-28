/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { EvaluacionPamecEntity } from "./evaluacion-pamec.entity";


@EntityRepository(EvaluacionPamecEntity)
export class EvaluacionPamecRepository extends Repository<EvaluacionPamecEntity> {

}