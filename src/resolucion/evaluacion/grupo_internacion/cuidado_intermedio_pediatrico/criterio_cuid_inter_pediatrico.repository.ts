import { EntityRepository, Repository } from "typeorm";
import { CriterioCuidIntermPediatricoEntity } from "./criterio_cuid_inter_pediatrico.entity";


@EntityRepository(CriterioCuidIntermPediatricoEntity)
export class CriterioCuidIntermPediatricoRepository extends Repository<CriterioCuidIntermPediatricoEntity> {
}