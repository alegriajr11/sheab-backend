import { EntityRepository, Repository } from "typeorm";
import { EvaluacionResVerificacionEntity } from "./evaluacion_res.entity";


@EntityRepository(EvaluacionResVerificacionEntity)
export class EvaluacionResVerificacionRepository extends Repository<EvaluacionResVerificacionEntity> {

}