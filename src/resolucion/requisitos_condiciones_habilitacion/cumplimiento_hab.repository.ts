/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CumplimientoHabilitacionEntity } from "./cumplimiento_habilitacion.entity";

@EntityRepository(CumplimientoHabilitacionEntity)
export class CumplimientoHabRepository extends Repository<CumplimientoHabilitacionEntity> {

}