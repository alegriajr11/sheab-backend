import { EntityRepository, Repository } from "typeorm";
import { PartoEntity } from "./parto.entity";



@EntityRepository(PartoEntity)
export class PartoRepository extends Repository<PartoEntity> {

}