import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCuidInterPediatricoEntity } from "./cumplimiento_cuid_inter_pediatrico.entity";



@EntityRepository(CumplimientoCuidInterPediatricoEntity)
export class CumplimientoCuidInterPediatricoRepository extends Repository<CumplimientoCuidInterPediatricoEntity> {

}