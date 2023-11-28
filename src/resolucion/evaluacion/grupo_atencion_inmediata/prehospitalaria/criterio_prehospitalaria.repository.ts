import { EntityRepository, Repository } from "typeorm";
import { CriterioPrehospitalariaEntity } from "./criterio_prehospitalaria.entity";




@EntityRepository(CriterioPrehospitalariaEntity)
export class CriterioPrehospitalariaRepository extends Repository<CriterioPrehospitalariaEntity> {

}