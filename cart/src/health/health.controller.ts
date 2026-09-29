// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Get()
  healthCheck() {
    const isConnected = this.dataSource.isInitialized;

    return {
      status: isConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: isConnected ? 'connected' : 'disconnected',
        ready: isConnected,
        type: this.dataSource.options.type,
        // Get database name if available
        name: this.dataSource.options.database || 'unknown',
      },
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
