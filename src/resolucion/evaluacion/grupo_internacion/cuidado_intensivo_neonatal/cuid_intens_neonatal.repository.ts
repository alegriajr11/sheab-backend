import { EntityRepository, Repository } from "typeorm";
import { CuidInteNeonatalEntity } from "./cuid_intens_neonatal.entity";



@EntityRepository(CuidInteNeonatalEntity)
export class CuidInteNeonatalRepository extends Repository<CuidInteNeonatalEntity> {

}