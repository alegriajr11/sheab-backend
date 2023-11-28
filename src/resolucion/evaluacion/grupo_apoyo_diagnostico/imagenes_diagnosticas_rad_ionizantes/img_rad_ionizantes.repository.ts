import { EntityRepository, Repository } from "typeorm";
import { ImgRadIonizantesEntity } from "./img_rad_ionizantes.entity";



@EntityRepository(ImgRadIonizantesEntity)
export class ImgRadIonizantesRepository extends Repository<ImgRadIonizantesEntity> {

}