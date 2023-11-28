import { EntityRepository, Repository } from "typeorm";
import { RadioterapiaEntity } from "./radioterapia.entity";



@EntityRepository(RadioterapiaEntity)
export class RadioterapiaRepository extends Repository<RadioterapiaEntity> {

}