import { EntityRepository, Repository } from "typeorm";
import { LabClinicoEntity } from "./laboratorio_clinico.entity";



@EntityRepository(LabClinicoEntity)
export class LabClinicoRepository extends Repository<LabClinicoEntity> {

}