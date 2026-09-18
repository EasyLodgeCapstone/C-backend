import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create_product' })
  async create(
    @Payload() CreateProductDto: CreateProductDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const productData = {
        ...CreateProductDto,
      };

      const result = await this.appService.create(productData);

      Logger.log(result);

      // Successfully processed
      channel.ack(msg);

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);

      // MongoDB duplicate key error
      if (errorDetails?.status === 409) {
        console.error('❌ Duplicate product/data. Not requeuing.');

        channel.nack(msg, false, false);
      }

      // MongoDB connection/server selection error
      else if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');

        channel.nack(msg, false, true);
      }

      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');

        channel.nack(msg, false, false);
      }

      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_products' })
  async findAll(
    @Payload() pag: { page: number; limit: number },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const { page, limit } = pag;
      const result = await this.appService.findAll(page, limit);
      channel.ack(msg);
      return result;
    }  catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);

      // MongoDB duplicate key error
      if (errorDetails?.status === 409) {
        console.error('❌ Duplicate product/data. Not requeuing.');

        channel.nack(msg, false, false);
      }

      // MongoDB connection/server selection error
      else if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');

        channel.nack(msg, false, true);
      }

      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');

        channel.nack(msg, false, false);
      }

      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_single_product' })
  async findOne(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.appService.findOne(id);
      channel.ack(msg);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);

      // MongoDB duplicate key error
      if (errorDetails?.status === 409) {
        console.error('❌ Duplicate product/data. Not requeuing.');

        channel.nack(msg, false, false);
      }

      // MongoDB connection/server selection error
      else if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');

        channel.nack(msg, false, true);
      }

      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');

        channel.nack(msg, false, false);
      }

      throw error;
    }
  }

  @MessagePattern({ cmd: 'update_product' })
  async update(
    @Payload() update: { id: string; updateProductDto: UpdateProductDto },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const { id, updateProductDto } = update;
      const result = await this.appService.update(id, updateProductDto);
      channel.ack(msg);
      return result;
    }  catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);

      // MongoDB duplicate key error
      if (errorDetails?.status === 409) {
        console.error('❌ Duplicate product/data. Not requeuing.');

        channel.nack(msg, false, false);
      }

      // MongoDB connection/server selection error
      else if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');

        channel.nack(msg, false, true);
      }

      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');

        channel.nack(msg, false, false);
      }

      throw error;
    }
  }

  @MessagePattern({ cmd: 'delete_product' })
  async remove(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.appService.remove(id);
      channel.ack(msg);

      return result;
    }  catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

      console.error('❌ Handler error:', message);

      // MongoDB duplicate key error
      if (errorDetails?.status === 409) {
        console.error('❌ Duplicate product/data. Not requeuing.');

        channel.nack(msg, false, false);
      }

      // MongoDB connection/server selection error
      else if (errorDetails?.status === 500 || errorDetails?.status === 503) {
        console.error('🔄 Temporary MongoDB/network error. Requeuing.');

        channel.nack(msg, false, true);
      }

      // Other errors
      else {
        console.error('❌ Unknown error. Not requeuing.');

        channel.nack(msg, false, false);
      }

      throw error;
    }
  }
}
