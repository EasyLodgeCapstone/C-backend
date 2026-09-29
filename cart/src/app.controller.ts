import { Controller, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'add_cart' })
  async create(
    @Payload() cart: { userId: string; productId: string; quantity: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const { userId, productId, quantity } = cart;
      const result = await this.appService.create(userId, productId, quantity);
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

      const status =
        typeof errorDetails?.status === 'number' ? errorDetails.status : 500;
      throw new HttpException(message, status);
    }
  }

  @MessagePattern({ cmd: 'fetch_cart' })
  async findAll(@Payload() userId: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const result = await this.appService.findAll(userId);
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

  @MessagePattern({ cmd: 'get_single_cart' })
  async findOne(
    @Payload() ids: { id: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const { id, userId } = ids;
      const result = await this.appService.findOne(id, userId);
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

  @MessagePattern({ cmd: 'update_quantity' })
  async update(
    @Payload() update: { userId: string; productId: string; quantity: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const { userId, productId, quantity } = update;
      const result = await this.appService.setQuantity(
        userId,
        productId,
        quantity,
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

  @MessagePattern({ cmd: 'delete_cart' })
  async delete(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const result = await this.appService.delete(id);
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

      const status =
        typeof errorDetails?.status === 'number' ? errorDetails.status : 500;
      throw new HttpException(message, status);
    }
  }
}
