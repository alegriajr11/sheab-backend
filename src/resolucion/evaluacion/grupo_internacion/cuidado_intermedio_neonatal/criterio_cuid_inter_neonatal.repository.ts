import { EntityRepository, Repository } from "typeorm";
import { CriterioCuidIntermNeonatalEntity } from "./criterio_cuid_inter_neonatal.entity";




@EntityRepository(CriterioCuidIntermNeonatalEntity)
export class CriterioCuidIntermNeonatalRepository extends Repository<CriterioCuidIntermNeonatalEntity> {

}