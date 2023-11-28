/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { PrestadorEntity } from "./prestador.entity";


@EntityRepository(PrestadorEntity)
export class PrestadorRepository extends Repository<PrestadorEntity> {
        
}