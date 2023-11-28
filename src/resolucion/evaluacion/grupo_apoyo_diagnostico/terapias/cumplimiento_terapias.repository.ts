import { EntityRepository, Repository } from "typeorm";
import { CumplimientoTerapiaEntity } from "./cumplimiento_terapias.entity";



@EntityRepository(CumplimientoTerapiaEntity)
export class CumplimientoTerapiaRepository extends Repository<CumplimientoTerapiaEntity> {

}