import { EntityRepository, Repository } from "typeorm";
import { DivCreadoSicEntity } from "./div-creado-sic.entity";

@EntityRepository(DivCreadoSicEntity)
export class DivCreadoSicRepository extends Repository<DivCreadoSicEntity> {

}