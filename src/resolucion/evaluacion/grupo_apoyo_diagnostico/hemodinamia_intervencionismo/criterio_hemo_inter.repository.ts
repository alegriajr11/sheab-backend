import { EntityRepository, Repository } from "typeorm";
import { CriterioHermoIntervenEntity } from "./criterio_hemo_inter.entity";




@EntityRepository(CriterioHermoIntervenEntity)
export class CriterioHermoIntervenRepository extends Repository<CriterioHermoIntervenEntity> {

}