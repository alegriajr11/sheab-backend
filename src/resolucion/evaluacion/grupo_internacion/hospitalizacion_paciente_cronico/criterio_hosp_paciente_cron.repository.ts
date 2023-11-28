import { EntityRepository, Repository } from "typeorm";
import { CriterioHospitCronicoEntity } from "./criterio_hosp_paciente_cron.entity";




@EntityRepository(CriterioHospitCronicoEntity)
export class CriterioHospitCronicoRepository extends Repository<CriterioHospitCronicoEntity> {

}