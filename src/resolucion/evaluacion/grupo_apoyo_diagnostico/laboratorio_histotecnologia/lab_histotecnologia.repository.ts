import { EntityRepository, Repository } from "typeorm";
import { LabHistotecnologiaEntity } from "./lab_histotecnologia.entity";



@EntityRepository(LabHistotecnologiaEntity)
export class LabHistotecnologiaRepository extends Repository<LabHistotecnologiaEntity> {

}