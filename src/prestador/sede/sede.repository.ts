import { EntityRepository, Repository } from "typeorm";
import { SedeEntity } from "./sede.entity";

@EntityRepository(SedeEntity)
export class SedeRepository extends Repository<SedeEntity> {

}