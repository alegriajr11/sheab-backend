import { EntityRepository, Repository } from "typeorm";
import { VacunacionEntity } from "./vacunacion.entity";



@EntityRepository(VacunacionEntity)
export class VacunacionRepository extends Repository<VacunacionEntity> {

}