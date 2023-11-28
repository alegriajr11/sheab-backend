import { EntityRepository, Repository } from "typeorm";
import { ServicioEntity } from "./servicio.entity";



@EntityRepository(ServicioEntity)
export class ServicioRepository extends Repository<ServicioEntity> {

}