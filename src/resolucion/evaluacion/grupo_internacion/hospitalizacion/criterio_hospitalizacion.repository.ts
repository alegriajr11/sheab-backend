import { EntityRepository, Repository } from "typeorm";
import { CriterioHospitalizacionEntity } from "./criterio_hospitalizacion.entity";


@EntityRepository(CriterioHospitalizacionEntity)
export class CriterioHospitalizacionRepository extends Repository<CriterioHospitalizacionEntity> {

}