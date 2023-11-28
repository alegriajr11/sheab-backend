/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ServiciosVerificadosEntity } from "./servicios_verificados.entity";



@EntityRepository(ServiciosVerificadosEntity)
export class ServiciosVerificadosRepository extends Repository<ServiciosVerificadosEntity> {

}