/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { SedeMunicipioEntity } from "./sede-municipio.entity";


@EntityRepository(SedeMunicipioEntity)
export class SedeMunicipioRepository extends Repository<SedeMunicipioEntity> {

}