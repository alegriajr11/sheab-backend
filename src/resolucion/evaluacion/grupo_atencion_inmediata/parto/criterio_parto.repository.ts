import { EntityRepository, Repository } from "typeorm";
import { CriterioPartoEntity } from "./criterio_parto.entity";




@EntityRepository(CriterioPartoEntity)
export class CriterioPartoRepository extends Repository<CriterioPartoEntity> {

}