/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { CalificacionIndEntity } from "./calificacionind.entity";


@EntityRepository(CalificacionIndEntity)
export class CalificacionIndRepository extends Repository<CalificacionIndEntity> {

}