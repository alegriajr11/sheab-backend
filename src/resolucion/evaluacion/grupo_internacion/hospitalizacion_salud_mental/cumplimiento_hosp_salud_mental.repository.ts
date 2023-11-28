import { EntityRepository, Repository } from "typeorm";
import { CumplimientoHospitalizacionMentalEntity } from "./cumplimiento_hosp_salud_mental.entity";



@EntityRepository(CumplimientoHospitalizacionMentalEntity)
export class CumplimientoHospitalizacionMentalRepository extends Repository<CumplimientoHospitalizacionMentalEntity> {

}