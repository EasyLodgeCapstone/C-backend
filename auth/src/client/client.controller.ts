import { Controller } from '@nestjs/common';
import { ClientService } from './client.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SigninAuthDto } from './dto/signin.auth';

@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @MessagePattern({ cmd: 'client_signup' })
  async create(
    @Payload() createAuthDto: CreateAuthDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = channel.getMessage();

    try {
      const result = await this.clientService.create(createAuthDto);
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
        console.error('❌ Duplicate name or email/data. Not requeuing.');

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

  @MessagePattern({ cmd: 'client_signin' })
  async signin(
    @Payload() SigninAuthDto: SigninAuthDto,
    ipAddress,
    userAgent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const result = await this.clientService.signin(
        SigninAuthDto,
        ipAddress,
        userAgent,
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

      // MongoDB duplicate key error
      if (errorDetails?.status === 409) {
        console.error('❌ Duplicate name or email/data. Not requeuing.');

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

  @MessagePattern({ cmd: 'client_verify' })
  async verify(@Payload() userId: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.clientService.verify(userId);
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
        console.error('❌ Duplicate name or email/data. Not requeuing.');

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
