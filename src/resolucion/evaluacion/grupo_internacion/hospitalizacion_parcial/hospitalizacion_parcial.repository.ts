import { EntityRepository, Repository } from "typeorm";
import { HospitalizacionParcialEntity } from "./hospitalizacion_parcial.entity";



@EntityRepository(HospitalizacionParcialEntity)
export class HospitalizacionParcialRepository extends Repository<HospitalizacionParcialEntity> {

}