import { EntityRepository, Repository } from "typeorm";
import { RadiologiaOdontoEntity } from "./radiologia_odont.entity";



@EntityRepository(RadiologiaOdontoEntity)
export class RadiologiaOdontoRepository extends Repository<RadiologiaOdontoEntity> {

}