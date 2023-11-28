import { EntityRepository, Repository } from "typeorm";
import { CumplimientoUrgenciasEntity } from "./cumplimiento_urgencias.entity";



@EntityRepository(CumplimientoUrgenciasEntity)
export class CumplimientoUrgenciasRepository extends Repository<CumplimientoUrgenciasEntity> {

}