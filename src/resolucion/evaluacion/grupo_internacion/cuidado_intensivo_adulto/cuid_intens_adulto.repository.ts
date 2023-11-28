import { EntityRepository, Repository } from "typeorm";
import { CuidIntAdultoEntity } from "./cuid_intens_adulto.entity";



@EntityRepository(CuidIntAdultoEntity)
export class CuidIntAdultoRepository extends Repository<CuidIntAdultoEntity> {

}