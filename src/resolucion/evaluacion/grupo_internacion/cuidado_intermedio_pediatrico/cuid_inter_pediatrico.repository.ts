import { EntityRepository, Repository } from "typeorm";
import { CuidIntermPediatricoEntity } from "./cuid_inter_pediatrico.entity";



@EntityRepository(CuidIntermPediatricoEntity)
export class CuidIntermPediatricoRepository extends Repository<CuidIntermPediatricoEntity> {
}