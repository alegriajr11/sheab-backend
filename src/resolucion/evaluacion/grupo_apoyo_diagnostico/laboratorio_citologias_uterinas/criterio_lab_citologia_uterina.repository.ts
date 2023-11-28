import { EntityRepository, Repository } from "typeorm";
import { CriterioLabUterinaEntity } from "./criterio_lab_citologia_uterina.entity";




@EntityRepository(CriterioLabUterinaEntity)
export class CriterioLabUterinaRepository extends Repository<CriterioLabUterinaEntity> {

}