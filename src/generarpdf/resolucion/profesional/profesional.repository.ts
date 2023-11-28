import { EntityRepository, Repository } from "typeorm";
import { ProfesionalApoyoEntity } from "./profesional.entity";



@EntityRepository(ProfesionalApoyoEntity)
export class ProfesionalApoyoRepository extends Repository<ProfesionalApoyoEntity> {
        
}