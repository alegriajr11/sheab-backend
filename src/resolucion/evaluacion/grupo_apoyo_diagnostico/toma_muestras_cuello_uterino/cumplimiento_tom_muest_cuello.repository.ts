import { EntityRepository, Repository } from "typeorm";
import { CumplimientoCuelloUterinoEntity } from "./cumplimiento_tom_muest_cuello.entity";



@EntityRepository(CumplimientoCuelloUterinoEntity)
export class CumplimientoCuelloUterinoRepository extends Repository<CumplimientoCuelloUterinoEntity> {

}