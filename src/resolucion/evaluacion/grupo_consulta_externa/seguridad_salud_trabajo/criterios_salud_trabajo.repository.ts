import { EntityRepository, Repository } from "typeorm";
import { CriterioSaludTrabajoEntity } from "./criterios_salud_trabajo.entity";



@EntityRepository(CriterioSaludTrabajoEntity)
export class CriterioSaludTrabajoRepository extends Repository<CriterioSaludTrabajoEntity> {

}