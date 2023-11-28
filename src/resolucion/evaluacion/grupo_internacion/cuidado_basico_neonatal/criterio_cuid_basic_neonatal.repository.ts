import { EntityRepository, Repository } from "typeorm";
import { CriterioCuidBasNeonatalEntity } from "./criterio_cuid_basic_neonatal.entity";




@EntityRepository(CriterioCuidBasNeonatalEntity)
export class CriterioCuidBasNeonatalRepository extends Repository<CriterioCuidBasNeonatalEntity> {

}