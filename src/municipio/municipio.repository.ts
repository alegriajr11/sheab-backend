/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { MunicipioEntity } from "./municipio.entity";

@EntityRepository(MunicipioEntity)
export class MunicipioRepository extends Repository<MunicipioEntity> {

}