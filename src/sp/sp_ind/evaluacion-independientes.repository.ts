/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { EvaluacionIndependientesEntity } from "./evaluacion-independientes.entity";


@EntityRepository(EvaluacionIndependientesEntity)
export class EvaluacionIndependientesRepository extends Repository<EvaluacionIndependientesEntity> {

}