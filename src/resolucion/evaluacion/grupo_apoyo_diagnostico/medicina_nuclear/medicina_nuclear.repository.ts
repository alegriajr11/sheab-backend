import { EntityRepository, Repository } from "typeorm";
import { MedNuclearEntity } from "./medicina_nuclear.entity";



@EntityRepository(MedNuclearEntity)
export class MedNuclearRepository extends Repository<MedNuclearEntity> {

}