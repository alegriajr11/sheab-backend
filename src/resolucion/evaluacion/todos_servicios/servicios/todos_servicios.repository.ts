/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { TodoServiciosEntity } from "./todos_servicios.entity";

@EntityRepository(TodoServiciosEntity)
export class TodoServiciosRepository extends Repository<TodoServiciosEntity> {

}