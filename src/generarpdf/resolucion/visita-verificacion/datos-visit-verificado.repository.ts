import { EntityRepository, Repository } from "typeorm";
import { DatosVisitVErificadoEntity } from "./datos-visit-verificado.entity";

@EntityRepository(DatosVisitVErificadoEntity)
export class DatosVerificadosRepository extends Repository<DatosVisitVErificadoEntity> {
        
}