import { EntityRepository, Repository } from "typeorm";
import { HermodIntervenEntity } from "./hemod_interven.entity";



@EntityRepository(HermodIntervenEntity)
export class HermodIntervenRepository extends Repository<HermodIntervenEntity> {

}