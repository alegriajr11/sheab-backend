import { EntityRepository, Repository } from "typeorm";
import { QuimioterapiaEntity } from "./quimioterapia.entity";



@EntityRepository(QuimioterapiaEntity)
export class QuimioterapiaRepository extends Repository<QuimioterapiaEntity> {

}