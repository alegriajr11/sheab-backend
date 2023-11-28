import { EntityRepository, Repository } from "typeorm";
import { MuestrasLabClinicoEntity } from "./tom_muestras.entity";



@EntityRepository(MuestrasLabClinicoEntity)
export class MuestrasLabClinicoRepository extends Repository<MuestrasLabClinicoEntity> {

}