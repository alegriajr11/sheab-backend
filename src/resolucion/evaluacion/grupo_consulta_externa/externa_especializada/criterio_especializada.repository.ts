import { EntityRepository, Repository } from "typeorm";
import { CriterioEspecializadaEntity } from "./criterio_especializada.entity";



@EntityRepository(CriterioEspecializadaEntity)
export class CriterioEspecializadaRepository extends Repository<CriterioEspecializadaEntity> {

}