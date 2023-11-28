import { EntityRepository, Repository } from "typeorm";
import { ServFarmaceuticoEntity } from "./servicio_farmaceutico.entity";



@EntityRepository(ServFarmaceuticoEntity)
export class ServFarmaceuticoRepository extends Repository<ServFarmaceuticoEntity> {

}