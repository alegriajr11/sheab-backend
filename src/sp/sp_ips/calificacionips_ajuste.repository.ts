/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CalificacionAjusteIpsEntity} from "./calificacionips_ajuste.entity";



@EntityRepository(CalificacionAjusteIpsEntity)
export class CalificacionIpsAjusteRepository extends Repository<CalificacionAjusteIpsEntity> {

}