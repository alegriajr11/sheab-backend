import { EntityRepository, Repository } from "typeorm";
import { CumplimientoTranspAsistencialEntity } from "./cumplimiento_trans_asistencial.entity";



@EntityRepository(CumplimientoTranspAsistencialEntity)
export class CumplimientoTranspAsistencialRepository extends Repository<CumplimientoTranspAsistencialEntity> {

}