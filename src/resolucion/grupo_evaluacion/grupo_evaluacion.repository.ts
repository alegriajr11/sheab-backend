import { EntityRepository, Repository } from "typeorm";
import { GrupoEvaluacionEntity } from "./grupo_evaluacion.entity";



@EntityRepository(GrupoEvaluacionEntity)
export class GrupoEvaluacionRepository extends Repository<GrupoEvaluacionEntity> {

}