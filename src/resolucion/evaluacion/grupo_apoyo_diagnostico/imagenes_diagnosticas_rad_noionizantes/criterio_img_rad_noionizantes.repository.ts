import { EntityRepository, Repository } from "typeorm";
import { CriterioImgRadNoIonizantesEntity } from "./criterio_img_rad_noionizantes.entity";




@EntityRepository(CriterioImgRadNoIonizantesEntity)
export class CriterioImgRadNoIonizanteRepository extends Repository<CriterioImgRadNoIonizantesEntity> {

}