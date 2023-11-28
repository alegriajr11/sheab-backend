import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCuidInterNeonatalEntity } from "./cumplimiento_cuid_inter_neonatal.entity";



@EntityRepository(CumplimientoCuidInterNeonatalEntity)
export class CumplimientoCuidInterNeonatalRepository extends Repository<CumplimientoCuidInterNeonatalEntity> {

}