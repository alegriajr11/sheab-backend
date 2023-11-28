/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { ActaSicPdfEntity } from "./sic-acta-pdf.entity";



@EntityRepository(ActaSicPdfEntity)
export class ActaSicPdfRepository extends Repository<ActaSicPdfEntity> {
        
}