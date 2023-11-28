import { EntityRepository, Repository } from "typeorm";
import { CriterioMuestraLabClinicoEntity } from "./criterio_tom_muestras.entity";




@EntityRepository(CriterioMuestraLabClinicoEntity)
export class CriterioMuestraLabClinicoRepository extends Repository<CriterioMuestraLabClinicoEntity> {

}