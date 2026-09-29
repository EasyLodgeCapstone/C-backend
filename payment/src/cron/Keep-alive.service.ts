// cron/keep-alive.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);
  private pingCount = 0;
  private successCount = 0;
  private failCount = 0;

  constructor(@InjectDataSource() private dataSource: DataSource) {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Cron('*/2 * * * *') // Every 2 minutes
  async keepAlive() {
    this.pingCount++;
    const startTime = Date.now();

    try {
      // 1. Check database connection
      const isConnected = this.dataSource.isInitialized;

      if (isConnected) {
        this.logger.log(`🔄 Database status:  Connected`);
      } else {
        this.logger.warn(`🔄 Database status: ❌ Disconnected`);
        // Try to reconnect if disconnected
        try {
          await this.dataSource.initialize();
          this.logger.log(' Database reconnected successfully');
        } catch (reconnectError) {
          this.logger.error(
            `❌ Failed to reconnect: ${reconnectError instanceof Error ? reconnectError.message : String(reconnectError)}`,
          );
        }
      }

      // 2. Ping your own health endpoint
      await this.pingHealthEndpoint();

      // 3. Ping frontend to keep it alive (optional but recommended)
      await this.pingFrontend();

      const duration = Date.now() - startTime;
      this.successCount++;
      this.logger.debug(`⏱️ Keep-alive completed in ${duration}ms`);
    } catch (error) {
      this.failCount++;
      this.logger.error(
        `❌ Keep-alive failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Log stats every 10 pings
    if (this.pingCount % 10 === 0) {
      this.logger.log(
        `📊 Stats: ${this.pingCount} pings | ${this.successCount} successes | ${this.failCount} failures`,
      );
    }
  }

  private async pingHealthEndpoint() {
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      'http://localhost:3002';

    if (!backendUrl) {
      this.logger.warn('⚠️ No BACKEND_URL found, skipping health check');
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        this.logger.log(
          ` Health check: ${response.status} - ${response.statusText}`,
        );
      } else {
        this.logger.warn(
          `⚠️ Health check: ${response.status} - ${response.statusText}`,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn(`⚠️ Health check timed out after 10 seconds`);
      } else {
        this.logger.warn(
          `⚠️ Health check failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  private async pingFrontend() {
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      // Don't log warning if not configured (optional)
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(frontendUrl, {
        method: 'HEAD', // HEAD is lighter than GET
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        this.logger.log(` Frontend ping: ${response.status}`);
      } else {
        this.logger.warn(`⚠️ Frontend ping: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn(`⚠️ Frontend ping timed out`);
      } else {
        this.logger.debug(
          `ℹ️ Frontend ping: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
}
