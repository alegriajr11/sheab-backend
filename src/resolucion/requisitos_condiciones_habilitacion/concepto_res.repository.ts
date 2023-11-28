/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ConceptoResEntity } from "./concepto_res.entity";

@EntityRepository(ConceptoResEntity)
export class ConceptoResRepository extends Repository<ConceptoResEntity> {

}