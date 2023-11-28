import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCuidIntNeonatalEntity } from "./cumplimiento_cuid_intens_neonatal.entity";



@EntityRepository(CumplimientoCuidIntNeonatalEntity)
export class CumplimientoCuidIntNeonatalRepository extends Repository<CumplimientoCuidIntNeonatalEntity> {

}