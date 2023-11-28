import { EntityRepository, Repository } from "typeorm";
import { CriterioPatologiaEntity } from "./criterio_patologia.entity";




@EntityRepository(CriterioPatologiaEntity)
export class CriterioPatologiaRepository extends Repository<CriterioPatologiaEntity> {

}