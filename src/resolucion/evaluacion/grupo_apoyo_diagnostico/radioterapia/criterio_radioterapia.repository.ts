import { EntityRepository, Repository } from "typeorm";
import { CriterioRadioterapiaEntity } from "./criterio_radioterapia.entity";




@EntityRepository(CriterioRadioterapiaEntity)
export class CriterioRadioterapiaRepository extends Repository<CriterioRadioterapiaEntity> {

}