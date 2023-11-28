/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ClaseEntity } from "./clase.entity";



@EntityRepository(ClaseEntity)
export class ClaseRepository extends Repository<ClaseEntity> {

}