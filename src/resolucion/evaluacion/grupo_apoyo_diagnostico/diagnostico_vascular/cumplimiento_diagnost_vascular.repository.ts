import { EntityRepository, Repository } from "typeorm";
import { CumplimientoDiagnosticoVascularEntity } from "./cumplimiento_diagnost_vascular.entity";

@EntityRepository(CumplimientoDiagnosticoVascularEntity)
export class CumplimientoDiagnRepository extends Repository<CumplimientoDiagnosticoVascularEntity> {

}