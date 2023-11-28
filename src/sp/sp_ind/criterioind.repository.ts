/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CriterioIndEntity } from "./criterioind.entity";

@EntityRepository(CriterioIndEntity)
export class CriterioIndRepository extends Repository<CriterioIndEntity> {

}