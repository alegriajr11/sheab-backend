import { EntityRepository, Repository } from "typeorm";
import { GestionPretransfusionalEntity } from "./gestion_pretrans.entity";



@EntityRepository(GestionPretransfusionalEntity)
export class GestionPretransfusionalRepository extends Repository<GestionPretransfusionalEntity> {

}