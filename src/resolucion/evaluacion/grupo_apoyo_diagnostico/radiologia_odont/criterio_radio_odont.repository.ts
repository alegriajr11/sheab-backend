import { EntityRepository, Repository } from "typeorm";
import { CriterioRadiologiaOdontoEntity } from "./criterio_radio_odont.entity";




@EntityRepository(CriterioRadiologiaOdontoEntity)
export class CriterioRadiologiaOdontoRepository extends Repository<CriterioRadiologiaOdontoEntity> {

}