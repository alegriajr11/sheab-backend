import { EntityRepository, Repository } from "typeorm";
import { CriterioTranspAsistencialEntity } from "./criterio_trans_asistencial.entity";




@EntityRepository(CriterioTranspAsistencialEntity)
export class CriterioTranspAsistencialRepository extends Repository<CriterioTranspAsistencialEntity> {

}