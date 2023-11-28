import { EntityRepository, Repository } from "typeorm";
import { CumplimientoMedNuclearEntity } from "./cumplimineto_medicina_nuclear.entity";



@EntityRepository(CumplimientoMedNuclearEntity)
export class CumplimientoMedNuclearRepository extends Repository<CumplimientoMedNuclearEntity> {

}