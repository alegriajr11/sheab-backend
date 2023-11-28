import { EntityRepository, Repository } from "typeorm";
import { CumplimientoGestionPretransfusionalEntity } from "./cumplimiento_gestion_pretrans.entity";



@EntityRepository(CumplimientoGestionPretransfusionalEntity)
export class CumplimientoGestionPretransfusionalRepository extends Repository<CumplimientoGestionPretransfusionalEntity> {

}