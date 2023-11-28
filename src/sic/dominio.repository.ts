/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { DominioEntity } from "./dominio.entity";


@EntityRepository(DominioEntity)
export class DominioRepository extends Repository<DominioEntity> {

}