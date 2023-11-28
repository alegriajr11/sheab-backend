import { EntityRepository, Repository } from "typeorm";
import { EvaluacionipsEntity } from "./evaluacionips.entity";
import { ItemEntity } from "./item.entity";


@EntityRepository(ItemEntity)
export class ItemIpsRepository extends Repository<ItemEntity> {

}