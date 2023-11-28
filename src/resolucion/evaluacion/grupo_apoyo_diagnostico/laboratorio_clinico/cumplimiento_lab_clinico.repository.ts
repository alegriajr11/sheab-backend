import { EntityRepository, Repository } from "typeorm";
import { CumplimientoLabClinicoEntity } from "./cumplimiento_lab_clinico.entity";



@EntityRepository(CumplimientoLabClinicoEntity)
export class CumplimientoLabClinicoRepository extends Repository<CumplimientoLabClinicoEntity> {

}