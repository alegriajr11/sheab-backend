import { EntityRepository, Repository } from "typeorm";
import { CumplimientoPrehospitalariaEntity } from "./cumplimiento_prehospitalaria.entity";



@EntityRepository(CumplimientoPrehospitalariaEntity)
export class CumplimientoPrehospitalariaRepository extends Repository<CumplimientoPrehospitalariaEntity> {

}