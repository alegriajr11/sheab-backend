import { EntityRepository, Repository } from "typeorm";
import { CumplimientoEspecializadaEntity } from "./cumplimiento_especializada.entity";


@EntityRepository(CumplimientoEspecializadaEntity)
export class CumplimientoEspecializadaRepository extends Repository<CumplimientoEspecializadaEntity> {

}