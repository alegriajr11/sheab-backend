import { EntityRepository, Repository } from "typeorm";
import { SaludTrabajoEntity } from "./salud_trabajo.entity";




@EntityRepository(SaludTrabajoEntity)
export class SaludTrabajoRepository extends Repository<SaludTrabajoEntity> {

}