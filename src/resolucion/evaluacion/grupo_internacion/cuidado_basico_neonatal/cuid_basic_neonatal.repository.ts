import { EntityRepository, Repository } from "typeorm";
import { CuidBasNeonatalEntity } from "./cuid_basic_neonatal.entity";



@EntityRepository(CuidBasNeonatalEntity)
export class CuidBasNeonatalRepository extends Repository<CuidBasNeonatalEntity> {

}