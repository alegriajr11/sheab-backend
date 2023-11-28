/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CumplimientoSicEntity } from "./cumplimientosic.entity";



@EntityRepository(CumplimientoSicEntity)
export class CumplimientoSicRepository extends Repository<CumplimientoSicEntity> {

}