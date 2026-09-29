import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveService } from './Keep-alive.service';

@Module({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  imports: [ScheduleModule.forRoot()],
  providers: [KeepAliveService],
})
export class CronModule {}
