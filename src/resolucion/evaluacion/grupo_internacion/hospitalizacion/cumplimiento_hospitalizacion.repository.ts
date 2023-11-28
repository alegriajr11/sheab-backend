import { EntityRepository, Repository } from "typeorm";
import { CumplimientoHospitalizacionEntity } from "./cumplimiento_hospitalizacion.entity";




@EntityRepository(CumplimientoHospitalizacionEntity)
export class CumplimientoHospitalizacionRepository extends Repository<CumplimientoHospitalizacionEntity> {

}