/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { TipoEntity } from "./tipo.entity";



@EntityRepository(TipoEntity)
export class TipoRepository extends Repository<TipoEntity> {

}