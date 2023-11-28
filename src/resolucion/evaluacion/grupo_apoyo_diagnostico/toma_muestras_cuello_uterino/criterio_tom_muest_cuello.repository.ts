import { EntityRepository, Repository } from "typeorm";
import { CriterioCuelloUterinoEntity } from "./criterio_tom_muest_cuello.entity";




@EntityRepository(CriterioCuelloUterinoEntity)
export class CriterioCuelloUterinoRepository extends Repository<CriterioCuelloUterinoEntity> {

}