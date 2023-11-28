import { EntityRepository, Repository } from "typeorm";
import { ContadorInformeEntity } from "./contador_informe.entity";


@EntityRepository(ContadorInformeEntity)
export class ContadorInformeRepository extends Repository<ContadorInformeEntity> {
}