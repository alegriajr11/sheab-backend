import { Module } from '@nestjs/common';
import { BackupBdController } from './backup_bd.controller';
import { BackupBdService } from './backup_bd.service';

@Module({
  controllers: [BackupBdController],
  providers: [BackupBdService]
})
export class BackupBdModule {}
