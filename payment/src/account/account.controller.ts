import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ cmd: 'account_create_account' })
  async create(
    @Payload() createAccountDto: CreateAccountDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const result = await this.accountService.create(createAccountDto);
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
        console.error('❌ Duplicate name . Not requeuing.');

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

  @MessagePattern({ cmd: 'account_fetch_account' })
  async findAll(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.accountService.findAll();
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
        console.error('❌ Duplicate  . Not requeuing.');

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

  @MessagePattern({ cmd: 'account_fetch_one' })
  async findOne(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const result = await this.accountService.findOne(id);
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
        console.error('❌ Duplicate name . Not requeuing.');

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

  @MessagePattern({ cmd: 'account_update_account' })
  async update(
    @Payload() update: { id: string; updateAccountDto: UpdateAccountDto },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const { id, updateAccountDto } = update;
      const result = await this.accountService.update(id, updateAccountDto);

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
        console.error('❌ Duplicate name . Not requeuing.');

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

  @MessagePattern({ cmd: 'account_delete' })
  async remove(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const result = await this.accountService.remove(id);
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
        console.error('❌ Duplicate name . Not requeuing.');

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
