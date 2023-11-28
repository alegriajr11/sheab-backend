import { EntityRepository, Repository } from "typeorm";
import { ImgRadNoIonizantesEntity } from "./img_rad_noionizantes.entity";



@EntityRepository(ImgRadNoIonizantesEntity)
export class ImgRadNoIonizantesRepository extends Repository<ImgRadNoIonizantesEntity> {

}