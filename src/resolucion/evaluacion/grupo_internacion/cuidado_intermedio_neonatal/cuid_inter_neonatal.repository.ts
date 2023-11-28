import { EntityRepository, Repository } from "typeorm";
import { CuidIntermNeonatalEntity } from "./cuid_inter_neonatal.entity";



@EntityRepository(CuidIntermNeonatalEntity)
export class CuidIntermNeonatalRepository extends Repository<CuidIntermNeonatalEntity> {

}