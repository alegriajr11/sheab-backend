/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from "typeorm";
import { EtapaInd } from "./etapaind.entity";



@EntityRepository(EtapaInd)
export class EtapaIndRepository extends Repository<EtapaInd> {

}