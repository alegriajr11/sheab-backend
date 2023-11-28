import { EntityRepository, Repository } from "typeorm";
import { ConclucionContadorEntity } from "./conclucion_contador.entity";


@EntityRepository(ConclucionContadorEntity)
export class ConclucionContadorRepository extends Repository<ConclucionContadorEntity> {
}