import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCuidBasNeonatalEntity } from "./cumplimiento_cuid_basic_neonatal.entity";



@EntityRepository(CumplimientoCuidBasNeonatalEntity)
export class CumplimientoCuidBasNeonatalRepository extends Repository<CumplimientoCuidBasNeonatalEntity> {

}