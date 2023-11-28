import { EntityRepository, Repository } from "typeorm";
import { ExternaEspecializadaEntity } from "./especializada.entity";



@EntityRepository(ExternaEspecializadaEntity)
export class ExternaEspecializadaRepository extends Repository<ExternaEspecializadaEntity> {

}