import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCirugiaEntity } from "./cumplimiento_cirugia.entity";



@EntityRepository(CumplimientoCirugiaEntity)
export class CumplimientoCirugiaRepository extends Repository<CumplimientoCirugiaEntity> {

}