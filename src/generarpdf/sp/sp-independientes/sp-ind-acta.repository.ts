/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ActaSpIndependientePdfEntity } from "./sp-ind-acta.entity";




@EntityRepository(ActaSpIndependientePdfEntity)
export class ActaSpIndependientePdfRepository extends Repository<ActaSpIndependientePdfEntity> {
        
}