import { EntityRepository, Repository } from "typeorm";
import { CumplimientoPatologiaEntity } from "./cumplimiento_patologia.entity";



@EntityRepository(CumplimientoPatologiaEntity)
export class CumplimientoPatologiaRepository extends Repository<CumplimientoPatologiaEntity> {

}