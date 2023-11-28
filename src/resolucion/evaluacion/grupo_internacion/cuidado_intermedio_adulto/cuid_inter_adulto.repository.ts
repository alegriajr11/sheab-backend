import { EntityRepository, Repository } from "typeorm";
import { CuidIntermAdultoEntity } from "./cuid_inter_adulto.entity";



@EntityRepository(CuidIntermAdultoEntity)
export class CuidIntermAdultoRepository extends Repository<CuidIntermAdultoEntity> {

}