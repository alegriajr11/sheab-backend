/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";


@EntityRepository(EvaluacionipsEntity)
export class EvaluacionIpsRepository extends Repository<EvaluacionipsEntity> {

}