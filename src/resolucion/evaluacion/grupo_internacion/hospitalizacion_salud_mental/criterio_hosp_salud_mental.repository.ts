import { EntityRepository, Repository } from "typeorm";
import { CriterioHospitalizacionMentalEntity } from "./criterio_hosp_salud_mental.entity";



@EntityRepository(CriterioHospitalizacionMentalEntity)
export class CriterioHospitalizacionMentalRepository extends Repository<CriterioHospitalizacionMentalEntity> {
}