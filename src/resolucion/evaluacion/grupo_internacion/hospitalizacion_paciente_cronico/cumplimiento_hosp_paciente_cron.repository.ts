import { EntityRepository, Repository } from "typeorm";
import { CumplimientoHospitCronicoEntity } from "./cumplimiento_hosp_paciente_cron.entity";



@EntityRepository(CumplimientoHospitCronicoEntity)
export class CumplimientoHospitCronicoRepository extends Repository<CumplimientoHospitCronicoEntity> {

}