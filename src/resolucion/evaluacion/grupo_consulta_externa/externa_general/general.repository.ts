import { EntityRepository, Repository } from "typeorm";
import { ExternaGeneralEntity } from "./general.entity";


@EntityRepository(ExternaGeneralEntity)
export class ExternaGeneralRepository extends Repository<ExternaGeneralEntity> {

}