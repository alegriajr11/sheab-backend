import { EntityRepository, Repository } from "typeorm";
import { CumplimientoRadOdontologicaEntity } from "./cumplimiento_radio_odont.entity";



@EntityRepository(CumplimientoRadOdontologicaEntity)
export class CumplimientoRadOdontologicaRepository extends Repository<CumplimientoRadOdontologicaEntity> {

}