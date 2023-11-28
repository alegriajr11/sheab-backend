/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { Criterio_servicios } from "./criterio_servicios.entity";
@EntityRepository(Criterio_servicios)
export class CriterioServiciosRepository extends Repository<Criterio_servicios> {

}