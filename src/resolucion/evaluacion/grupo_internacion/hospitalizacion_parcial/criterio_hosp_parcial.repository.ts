import { EntityRepository, Repository } from "typeorm";
import { CriterioHospitalizacionParcialEntity } from "./criterio_hosp_parcial.entity";




@EntityRepository(CriterioHospitalizacionParcialEntity)
export class CriterioHospitalizacionParcialRepository extends Repository<CriterioHospitalizacionParcialEntity> {

}