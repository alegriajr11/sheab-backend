import { EntityRepository, Repository } from "typeorm";
import { CriterioCuidInteNeonatalEntity } from "./criterio_cuid_intens_neonatal.entity";




@EntityRepository(CriterioCuidInteNeonatalEntity)
export class CriterioCuidInteNeonatalRepository extends Repository<CriterioCuidInteNeonatalEntity> {

}