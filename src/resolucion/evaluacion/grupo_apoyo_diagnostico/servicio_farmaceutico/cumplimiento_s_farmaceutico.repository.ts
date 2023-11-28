import { EntityRepository, Repository } from "typeorm";
import { CumplimientoSerFarmaceuticoEntity } from "./cumplimiento_s_farmaceutico.entity";



@EntityRepository(CumplimientoSerFarmaceuticoEntity)
export class CumplimientoSerFarmaceuticoRepository extends Repository<CumplimientoSerFarmaceuticoEntity> {

}