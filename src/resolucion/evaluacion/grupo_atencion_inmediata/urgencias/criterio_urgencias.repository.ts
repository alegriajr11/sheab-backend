import { EntityRepository, Repository } from "typeorm";
import { CriterioUrgenciasEntity } from "./criterio_urgencias.entity";




@EntityRepository(CriterioUrgenciasEntity)
export class CriterioUrgenciasRepository extends Repository<CriterioUrgenciasEntity> {

}