import { EntityRepository, Repository } from "typeorm";
import { CriterioConsumoPsicoactivasEntity } from "./criterio_cuid_cons_psicoact.entity";



@EntityRepository(CriterioConsumoPsicoactivasEntity)
export class CriterioConsumoPsicoactivasRepository extends Repository<CriterioConsumoPsicoactivasEntity> {

}