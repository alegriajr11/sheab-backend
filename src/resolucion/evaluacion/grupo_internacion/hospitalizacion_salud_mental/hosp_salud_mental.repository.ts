import { EntityRepository, Repository } from "typeorm";
import { HospitalizacionMentalEntity } from "./hosp_salud_mental.entity";



@EntityRepository(HospitalizacionMentalEntity)
export class HospitalizacionMentalRepository extends Repository<HospitalizacionMentalEntity> {

}