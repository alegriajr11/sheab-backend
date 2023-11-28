/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CumplimientoEstandarSicEntity } from "./cumplimientoestandar.entity";




@EntityRepository(CumplimientoEstandarSicEntity)
export class CumplimientoEstandarSicRepository extends Repository<CumplimientoEstandarSicEntity> {

}