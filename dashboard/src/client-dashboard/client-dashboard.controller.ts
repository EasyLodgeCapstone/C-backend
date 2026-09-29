import { Controller } from '@nestjs/common';
import { ClientDashboardService } from './client-dashboard.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class ClientDashboardController {
  constructor(
    private readonly clientDashboardService: ClientDashboardService,
  ) {}

  @MessagePattern({ cmd: 'fetch_Spec_Product' })
  async findAllSkincare(
    @Payload() query: { category: string; page: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const { category, page } = query;
      const result = await this.clientDashboardService.findSpecProduct(
        category,
        page,
      );

      channel.ack(msg);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);
      // MongoDB connection/server selection error
      if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');
        channel.nack(msg, false, true);
      }
      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');
        channel.nack(msg, false, false);
      }

      // NO throw. The message is already settled.
    }
  }

  @MessagePattern({ cmd: 'fetch_account' })
  async getAccount(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.clientDashboardService.getAccount();

      channel.ack(msg);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);
      // MongoDB connection/server selection error
      if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');
        channel.nack(msg, false, true);
      }
      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');
        channel.nack(msg, false, false);
      }

      // NO throw. The message is already settled.
    }
  }

  @MessagePattern({ cmd: 'fetch_one' })
  async findOne(@Payload() productId: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.clientDashboardService.findOne(productId);
      channel.ack(msg);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);
      // MongoDB connection/server selection error
      if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');
        channel.nack(msg, false, true);
      }
      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');
        channel.nack(msg, false, false);
      }

      // NO throw. The message is already settled.
    }
  }
}
