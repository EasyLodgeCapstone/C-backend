// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()) + 's',
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
        heapTotal:
          Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
        heapUsed:
          Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      },
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
