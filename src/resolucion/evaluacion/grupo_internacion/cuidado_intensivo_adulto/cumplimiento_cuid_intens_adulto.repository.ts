import { EntityRepository, Repository } from "typeorm";
import { CumplimientoIntAdultoEntity } from "./cumplimiento_cuid_intens_adulto.entity";



@EntityRepository(CumplimientoIntAdultoEntity)
export class CumplimientoIntAdultoRepository extends Repository<CumplimientoIntAdultoEntity> {

}