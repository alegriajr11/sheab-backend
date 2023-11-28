/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CumplimientoServiciosEntity } from "./cumplimiento_servicios.entity";

@EntityRepository(CumplimientoServiciosEntity)
export class CumplimientoServiciosRepository extends Repository<CumplimientoServiciosEntity> {

}