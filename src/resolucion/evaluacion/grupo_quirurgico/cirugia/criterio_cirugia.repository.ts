import { EntityRepository, Repository } from "typeorm";
import { CriterioCirugiaEntity } from "./criterio_cirugia.entity";




@EntityRepository(CriterioCirugiaEntity)
export class CriterioCirugiaRepository extends Repository<CriterioCirugiaEntity> {

}