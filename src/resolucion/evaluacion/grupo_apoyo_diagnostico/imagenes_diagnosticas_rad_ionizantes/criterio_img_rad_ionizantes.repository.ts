import { EntityRepository, Repository } from "typeorm";
import { CriterioImgRadIonizantesEntity } from "./criterio_img_rad_ionizantes.entity";




@EntityRepository(CriterioImgRadIonizantesEntity)
export class CriterioImgRadIonizanteRepository extends Repository<CriterioImgRadIonizantesEntity> {

}