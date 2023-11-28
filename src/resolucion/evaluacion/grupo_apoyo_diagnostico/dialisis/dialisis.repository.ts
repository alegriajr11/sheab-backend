import { EntityRepository, Repository } from "typeorm";
import { DialisisEntity } from "./dialisis.entity";



@EntityRepository(DialisisEntity)
export class DialisisRepository extends Repository<DialisisEntity> {

}