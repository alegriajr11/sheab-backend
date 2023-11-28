import { EntityRepository, Repository } from "typeorm";
import { CumplimientoImgRadIonizanteEntity } from "./cumplimiento_img_rad_ionizantes.entity";



@EntityRepository(CumplimientoImgRadIonizanteEntity)
export class CumplimientoImgRadIonizanteRepository extends Repository<CumplimientoImgRadIonizanteEntity> {

}