import { EntityRepository, Repository } from "typeorm";
import { CriterioDiagnostVascularEntity } from "./criterio_diagnost_vascular.entity";




@EntityRepository(CriterioDiagnostVascularEntity)
export class CriterioDiagnostVascularRepository extends Repository<CriterioDiagnostVascularEntity> {

}