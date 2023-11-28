/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CriterioAjusteEntity } from "./criterioajuste.entity";


@EntityRepository(CriterioAjusteEntity)
export class CriterioAjusteRepository extends Repository<CriterioAjusteEntity> {

}