import { EntityRepository, Repository } from "typeorm";
import { CuelloUterinoEntity } from "./tom_muestras_cuello_uter.entity";



@EntityRepository(CuelloUterinoEntity)
export class CuelloUterinoRepository extends Repository<CuelloUterinoEntity> {

}