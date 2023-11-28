import { EntityRepository, Repository } from "typeorm";
import { CriterioGestionPretransfusionalEntity } from "./criterio_gestion_pretrans.entity";




@EntityRepository(CriterioGestionPretransfusionalEntity)
export class CriterioGestionPretransfusionalRepository extends Repository<CriterioGestionPretransfusionalEntity> {

}