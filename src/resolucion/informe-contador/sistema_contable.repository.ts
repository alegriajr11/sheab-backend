import { EntityRepository, Repository } from "typeorm";
import { SistemaContableEntity } from "./sistema_contable.entity";


@EntityRepository(SistemaContableEntity)
export class SistemaContableRepository extends Repository<SistemaContableEntity> {
}