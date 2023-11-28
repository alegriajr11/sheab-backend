import { EntityRepository, Repository } from "typeorm";
import { ConsumoPsicoactivasEntity } from "./cuid_consumo_psicoactivas.entity";



@EntityRepository(ConsumoPsicoactivasEntity)
export class ConsumoPsicoactivasRepository extends Repository<ConsumoPsicoactivasEntity> {

}