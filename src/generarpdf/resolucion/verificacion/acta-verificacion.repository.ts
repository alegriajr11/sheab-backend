/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ActaVerificacionEntity } from "./acta-verificacion.entity";



@EntityRepository(ActaVerificacionEntity)
export class ActaCerificacionRepository extends Repository<ActaVerificacionEntity> {
        
}