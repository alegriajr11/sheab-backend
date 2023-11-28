import { EntityRepository, Repository } from "typeorm";
import { UrgenciasEntity } from "./urgencias.entity";



@EntityRepository(UrgenciasEntity)
export class UrgenciasRepository extends Repository<UrgenciasEntity> {

}