import { EntityRepository, Repository } from "typeorm";
import { CriterioSerFarmaceuticoEntity } from "./criterios_s_farmaceutico.entity";




@EntityRepository(CriterioSerFarmaceuticoEntity)
export class CriterioSerFarmaceuticoRepository extends Repository<CriterioSerFarmaceuticoEntity> {

}