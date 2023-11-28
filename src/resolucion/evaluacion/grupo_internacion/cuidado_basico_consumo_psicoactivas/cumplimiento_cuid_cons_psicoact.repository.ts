import { EntityRepository, Repository } from "typeorm";
import { CumplimientoConsPsicoactivasEntity } from "./cumplimiento_cuid_cons_psicoact.entity";



@EntityRepository(CumplimientoConsPsicoactivasEntity)
export class CumplimientoConsPsicoactivasRepository extends Repository<CumplimientoConsPsicoactivasEntity> {

}