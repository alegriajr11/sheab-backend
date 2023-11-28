import { EntityRepository, Repository } from "typeorm";
import { CumplimientoMuestLabClinicoEntity } from "./cumplimiento_tom_muestras.entity";



@EntityRepository(CumplimientoMuestLabClinicoEntity)
export class CumplimientoMuestLabClinicoRepository extends Repository<CumplimientoMuestLabClinicoEntity> {

}