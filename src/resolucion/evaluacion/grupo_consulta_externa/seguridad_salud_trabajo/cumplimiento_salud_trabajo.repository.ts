import { EntityRepository, Repository } from "typeorm";
import { CumplimientoSaludTrabajoEntity } from "./cumplimiento_salud_trabajo.entity";



@EntityRepository(CumplimientoSaludTrabajoEntity)
export class CumplimientoSaludTrabajoRepository extends Repository<CumplimientoSaludTrabajoEntity> {

}