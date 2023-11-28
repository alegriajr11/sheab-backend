import { EntityRepository, Repository } from "typeorm";
import { DiagnosticoVascularEntity } from "./diagnostico_vascular.entity";



@EntityRepository(DiagnosticoVascularEntity)
export class DiagnosticoVascularRepository extends Repository<DiagnosticoVascularEntity> {

}