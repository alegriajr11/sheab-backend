import { EntityRepository, Repository } from "typeorm";
import { CumplimientoPartoEntity } from "./cumplimiento_parto.entity";



@EntityRepository(CumplimientoPartoEntity)
export class CumplimientoPartoRepository extends Repository<CumplimientoPartoEntity> {

}