import { EntityRepository, Repository } from "typeorm";
import { CumplimientoDialisisEntity } from "./cumplimiento_dialisis.entity";



@EntityRepository(CumplimientoDialisisEntity)
export class CumplimientoDialisisRepository extends Repository<CumplimientoDialisisEntity> {

}