import { EntityRepository, Repository } from "typeorm";
import { CriterioVerificacionEntity } from "./criterioverificacion.entity";


@EntityRepository(CriterioVerificacionEntity)
export class CriterioVerifiRepository extends Repository<CriterioVerificacionEntity> {

}