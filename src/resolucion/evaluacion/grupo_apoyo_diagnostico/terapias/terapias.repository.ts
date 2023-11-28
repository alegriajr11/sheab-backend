import { EntityRepository, Repository } from "typeorm";
import { TerapiasEntity } from "./terapias.entity";



@EntityRepository(TerapiasEntity)
export class TerapiaRepository extends Repository<TerapiasEntity> {

}