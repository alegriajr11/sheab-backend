import { EntityRepository, Repository } from "typeorm";
import { CirugiaEntity } from "./cirugia.entity";



@EntityRepository(CirugiaEntity)
export class CirugiaRepository extends Repository<CirugiaEntity> {

}