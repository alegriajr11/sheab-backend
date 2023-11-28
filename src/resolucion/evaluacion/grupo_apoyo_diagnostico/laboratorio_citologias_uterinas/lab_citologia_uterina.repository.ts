import { EntityRepository, Repository } from "typeorm";
import { LabCitologiaUterinaEntity } from "./lab_citologia_uterina.entity";



@EntityRepository(LabCitologiaUterinaEntity)
export class LabCitologiaUterinaRepository extends Repository<LabCitologiaUterinaEntity> {

}