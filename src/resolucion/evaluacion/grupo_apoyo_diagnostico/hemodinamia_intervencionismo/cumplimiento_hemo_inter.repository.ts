import { EntityRepository, Repository } from "typeorm";
import { CumplimientoHermoIntervenEntity } from "./cumplimiento_hemo_inter.entity";



@EntityRepository(CumplimientoHermoIntervenEntity)
export class CumplimientoHermoIntervenRepository extends Repository<CumplimientoHermoIntervenEntity> {

}