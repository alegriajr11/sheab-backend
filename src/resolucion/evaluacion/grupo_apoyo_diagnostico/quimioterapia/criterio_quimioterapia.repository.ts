import { EntityRepository, Repository } from "typeorm";
import { CriterioQuimioterapiaEntity } from "./criterio_quimioterapia.entity";




@EntityRepository(CriterioQuimioterapiaEntity)
export class CriterioQuimioterapiaRepository extends Repository<CriterioQuimioterapiaEntity> {

}