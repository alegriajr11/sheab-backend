import { EntityRepository, Repository } from "typeorm";
import { CumplimientoQuimioterapiaEntity } from "./cumplimiento_quimioterapia.entity";



@EntityRepository(CumplimientoQuimioterapiaEntity)
export class CumplimientoQuimioterapiaRepository extends Repository<CumplimientoQuimioterapiaEntity> {

}