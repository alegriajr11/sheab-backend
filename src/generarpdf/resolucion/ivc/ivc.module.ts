import { Module } from '@nestjs/common';
import { IvcService } from './ivc.service';
import { IvcController } from './ivc.controller';

@Module({
  providers: [IvcService],
  controllers: [IvcController]
})
export class IvcModule {}
