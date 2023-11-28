import { EntityRepository, Repository } from "typeorm";
import { CriterioVacunacionEntity } from "./criterio_vacunacion.entity";




@EntityRepository(CriterioVacunacionEntity)
export class CriterioVacunacionRepository extends Repository<CriterioVacunacionEntity> {

}