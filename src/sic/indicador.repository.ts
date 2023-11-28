/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { IndicadorEntity } from "./indicador.entity";


@EntityRepository(IndicadorEntity)
export class IndicadorRepository extends Repository<IndicadorEntity> {

}