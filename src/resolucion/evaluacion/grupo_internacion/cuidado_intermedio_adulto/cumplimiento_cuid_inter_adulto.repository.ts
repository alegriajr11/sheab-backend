import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCuidInterAdultoEntity } from "./cumplimiento_cuid_inter_adulto.entity";



@EntityRepository(CumplimientoCuidInterAdultoEntity)
export class CumplimientoCuidInterAdultoRepository extends Repository<CumplimientoCuidInterAdultoEntity> {

}