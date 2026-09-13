import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveService } from './Keep-alive.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [KeepAliveService],
})
export class CronModule {}
