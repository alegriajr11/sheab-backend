import { EntityRepository, Repository } from "typeorm";
import { CriterioDialisisEntity } from "./criterio_dialisis.entity";




@EntityRepository(CriterioDialisisEntity)
export class CriterioDialisisRepository extends Repository<CriterioDialisisEntity> {

}