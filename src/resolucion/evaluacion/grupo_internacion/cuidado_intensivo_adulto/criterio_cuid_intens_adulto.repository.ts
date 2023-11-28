import { EntityRepository, Repository } from "typeorm";
import { CriterioCuidIntensAdultoEntity } from "./criterio_cuid_intens_adulto.entity";




@EntityRepository(CriterioCuidIntensAdultoEntity)
export class CriterioCuidIntensAdultoRepository extends Repository<CriterioCuidIntensAdultoEntity> {
}