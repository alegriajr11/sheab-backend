/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CapacidadInstaladaEntity } from "./capacidad_instalada.entity";


@EntityRepository(CapacidadInstaladaEntity)
export class CapacidadInstaladaRepository extends Repository<CapacidadInstaladaEntity> {

}