import { EntityRepository, Repository } from "typeorm";
import { CumplimientoHospitalizacionParcialEntity } from "./cumplimiento_hosp_parcial.entity";



@EntityRepository(CumplimientoHospitalizacionParcialEntity)
export class CumplimientoHospitalizacionParcialRepository extends Repository<CumplimientoHospitalizacionParcialEntity> {

}