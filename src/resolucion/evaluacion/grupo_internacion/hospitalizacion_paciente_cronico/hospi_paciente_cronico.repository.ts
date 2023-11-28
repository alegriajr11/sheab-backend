import { EntityRepository, Repository } from "typeorm";
import { HospitalizacionCronicoEntity } from "./hospi_paciente_cronico.entity";



@EntityRepository(HospitalizacionCronicoEntity)
export class HospitalizacionCronicoRepository extends Repository<HospitalizacionCronicoEntity> {

}