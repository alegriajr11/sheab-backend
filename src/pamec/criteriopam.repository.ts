/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CriteriopamEntity } from "./criteriopam.entity";

@EntityRepository(CriteriopamEntity)
export class CriterioPamRepository extends Repository<CriteriopamEntity> {

}