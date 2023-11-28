import { EntityRepository, Repository } from "typeorm";
import { CriterioCuidIntermAdultoEntity } from "./criterio_cuid_inter_adulto.entity";




@EntityRepository(CriterioCuidIntermAdultoEntity)
export class CriterioCuidIntermAdultoRepository extends Repository<CriterioCuidIntermAdultoEntity> {

}