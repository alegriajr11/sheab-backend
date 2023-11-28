import { EntityRepository, Repository } from "typeorm";
import { CumplimientoExternaGeneralEntity } from "./cumplimiento_ext_general.entity";


@EntityRepository(CumplimientoExternaGeneralEntity)
export class CumplimientoExternaGeneralRepository extends Repository<CumplimientoExternaGeneralEntity> {

}