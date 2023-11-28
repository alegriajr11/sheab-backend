import { EntityRepository, Repository } from "typeorm";
import { CriterioLabClinicoEntity } from "./criterio_lab_clinico.entity";




@EntityRepository(CriterioLabClinicoEntity)
export class CriterioLabClinicoRepository extends Repository<CriterioLabClinicoEntity> {

}