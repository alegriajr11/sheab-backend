/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { AuditoriaRegistroEntity } from "./auditoria_registro.entity";



@EntityRepository(AuditoriaRegistroEntity)
export class AuditoriaRegistroRepository extends Repository<AuditoriaRegistroEntity> {
        
}