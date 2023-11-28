import { EntityRepository, Repository } from "typeorm";
import { CriterioCuidIntePediatricoEntity } from "./criterio_cuid_intens_pediatrico.entity";




@EntityRepository(CriterioCuidIntePediatricoEntity)
export class CriterioCuidIntePediatricoRepository extends Repository<CriterioCuidIntePediatricoEntity> {

}