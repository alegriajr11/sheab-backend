import { EntityRepository, Repository } from "typeorm";
import { PatologiaEntity } from "./patologia.entity";



@EntityRepository(PatologiaEntity)
export class PatologiaRepository extends Repository<PatologiaEntity> {

}