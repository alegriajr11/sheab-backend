import { EntityRepository, Repository } from "typeorm";
import { HospitalizacionEntity } from "./hospitalizacion.entity";


@EntityRepository(HospitalizacionEntity)
export class HospitalizacionRepository extends Repository<HospitalizacionEntity> {

}