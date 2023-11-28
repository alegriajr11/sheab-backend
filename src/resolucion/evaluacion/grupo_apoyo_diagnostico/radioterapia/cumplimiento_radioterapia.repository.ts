import { EntityRepository, Repository } from "typeorm";
import { CumplimientoRadioterapiaEntity } from "./cumplimiento_radioterapia.entity";



@EntityRepository(CumplimientoRadioterapiaEntity)
export class CumplimientoRadioterapiaRepository extends Repository<CumplimientoRadioterapiaEntity> {

}