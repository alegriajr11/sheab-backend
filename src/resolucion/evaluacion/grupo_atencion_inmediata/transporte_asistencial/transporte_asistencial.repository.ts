import { EntityRepository, Repository } from "typeorm";
import { TranspAsistencialEntity } from "./transporte_asistencial.entity";



@EntityRepository(TranspAsistencialEntity)
export class TranspAsistencialRepository extends Repository<TranspAsistencialEntity> {

}