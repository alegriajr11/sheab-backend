import { EntityRepository, Repository } from "typeorm";
import { CumplimientoImgRadNoIonizanteEntity } from "./cumplimiento_img_rad_noionizantes.entity";



@EntityRepository(CumplimientoImgRadNoIonizanteEntity)
export class CumplimientoImgRadNoIonizanteRepository extends Repository<CumplimientoImgRadNoIonizanteEntity> {

}