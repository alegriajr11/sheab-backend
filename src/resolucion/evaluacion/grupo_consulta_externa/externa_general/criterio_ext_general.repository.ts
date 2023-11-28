import { EntityRepository, Repository } from "typeorm";
import { CriterioExternaGeneralEntity } from "./criterio_ext_general.entity";


@EntityRepository(CriterioExternaGeneralEntity)
export class CriterioExternaGeneralRepository extends Repository<CriterioExternaGeneralEntity> {

}