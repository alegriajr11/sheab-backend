import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCuidIntPediatricoEntity } from "./cumplimiento_cuid_intens_pediatrico.entity";



@EntityRepository(CumplimientoCuidIntPediatricoEntity)
export class CumplimientoCuidIntPediatricoRepository extends Repository<CumplimientoCuidIntPediatricoEntity> {

}