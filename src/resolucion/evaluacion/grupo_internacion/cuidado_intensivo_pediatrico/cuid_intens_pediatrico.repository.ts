import { EntityRepository, Repository } from "typeorm";
import { CuidIntePediatricoEntity } from "./cuid_intens_pediatrico.entity";



@EntityRepository(CuidIntePediatricoEntity)
export class CuidIntePediatricoRepository extends Repository<CuidIntePediatricoEntity> {

}