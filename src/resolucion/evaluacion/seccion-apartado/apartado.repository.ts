import { EntityRepository, Repository } from "typeorm";
import { ApartadoEntity } from "./apartado.entity";


@EntityRepository(ApartadoEntity)
export class ApartadoRepository extends Repository<ApartadoEntity> {

}