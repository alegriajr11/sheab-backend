import { EntityRepository, Repository } from "typeorm";
import { CumplimientoLabHistotecnEntity } from "./cumplimiento_lab_histotec.entity";



@EntityRepository(CumplimientoLabHistotecnEntity)
export class CumplimientoLabHistotecnRepository extends Repository<CumplimientoLabHistotecnEntity> {

}