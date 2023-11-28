import { EntityRepository, Repository } from "typeorm";
import { CumplimientoVacunacionEntity } from "./cumplimiento_vacunacion.entity";



@EntityRepository(CumplimientoVacunacionEntity)
export class CumplimientoVacunacionRepository extends Repository<CumplimientoVacunacionEntity> {

}