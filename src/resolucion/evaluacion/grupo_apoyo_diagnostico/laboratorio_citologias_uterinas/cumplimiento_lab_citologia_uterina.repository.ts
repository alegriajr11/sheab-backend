import { EntityRepository, Repository } from "typeorm";
import { CumplimientoLabUterinaEntity } from "./cumplimiento_lab_citologia_uterina.entity";



@EntityRepository(CumplimientoLabUterinaEntity)
export class CumplimientoLabUterinaRepository extends Repository<CumplimientoLabUterinaEntity> {

}