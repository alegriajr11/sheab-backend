import { EntityRepository, Repository } from "typeorm";
import { PrehospitalariaEntity } from "./prehospitalaria.entity";



@EntityRepository(PrehospitalariaEntity)
export class PrehospitalariaRepository extends Repository<PrehospitalariaEntity> {

}