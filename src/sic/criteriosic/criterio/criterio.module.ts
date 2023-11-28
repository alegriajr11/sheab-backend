import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriosicEntity } from 'src/sic/criteriosic.entity';
import { CriterioController } from './criterio.controller';
import { CriterioService } from './criterio.service';

@Module({
    imports: [TypeOrmModule.forFeature([CriteriosicEntity])],
    controllers: [CriterioController],
    providers: [CriterioService]
})

export class CriterioModule {}
