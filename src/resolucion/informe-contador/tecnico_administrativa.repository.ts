import { EntityRepository, Repository } from "typeorm";
import { TecnicoAdministrativaEntity } from "./tecnico_administrativa.entity";


@EntityRepository(TecnicoAdministrativaEntity)
export class TecnicoAdministrativaRepository extends Repository<TecnicoAdministrativaEntity> {
}