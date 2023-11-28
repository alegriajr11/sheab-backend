import { EntityRepository, Repository } from "typeorm";
import { CriterioLabHistotecnologiaEntity } from "./criterio_lab_histotec.entity";



@EntityRepository(CriterioLabHistotecnologiaEntity)
export class CriterioLabHistotecnologiaRepository extends Repository<CriterioLabHistotecnologiaEntity> {

}