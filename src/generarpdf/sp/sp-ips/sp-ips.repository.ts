/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ActaSpIpsEntity } from "./sp-ips.entity";




@EntityRepository(ActaSpIpsEntity)
export class ActaSpIpsRepository extends Repository<ActaSpIpsEntity> {
        
}