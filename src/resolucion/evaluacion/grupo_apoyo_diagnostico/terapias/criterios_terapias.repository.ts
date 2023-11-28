import { EntityRepository, Repository } from "typeorm";
import { CriterioTerapiaEntity } from "./criterios_terapias.entity";




@EntityRepository(CriterioTerapiaEntity)
export class CriterioTerapiaRepository extends Repository<CriterioTerapiaEntity> {

}