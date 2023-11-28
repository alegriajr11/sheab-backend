import { EntityRepository, Repository } from "typeorm";
import { CriterioMedicinaNuclearEntity } from "./criterio_medicina_nuclear.entity";




@EntityRepository(CriterioMedicinaNuclearEntity)
export class CriterioMedicinaNuclearRepository extends Repository<CriterioMedicinaNuclearEntity> {

}