import { Module } from '@nestjs/common';
import { ItemipsService } from './itemips.service';
import { ItemipsController } from './itemips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  providers: [ItemipsService],
  controllers: [ItemipsController]
})
export class ItemipsModule {}
