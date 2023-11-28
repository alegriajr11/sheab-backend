/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ActaPamecEntity } from "./pamec-acta.entity";




@EntityRepository(ActaPamecEntity)
export class ActaPamecRepository extends Repository<ActaPamecEntity> {
        
}