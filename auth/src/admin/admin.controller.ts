import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { signupDto } from './Dto/signupDto';
import { signinDto } from './Dto/signinDto';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @MessagePattern({ cmd: 'sign_up' })
  async signup(@Payload() signupDto: signupDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    try {
      const result = await this.adminService.signup(signupDto);

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

  @MessagePattern({ cmd: 'sign_in' })
  async signIn(@Payload() signinDto: signinDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.adminService.signin(signinDto);

      channel.ack(msg);

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

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

      throw error;
    }
  }

  @MessagePattern({ cmd: 'verify' })
  async verify(@Payload() userId: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    try {
      const result = await this.adminService.verify(userId);

      channel.ack(msg);

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const errorDetails =
        typeof error === 'object' && error !== null
          ? (error as Record<string, unknown>)
          : undefined;

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

      throw error;
    }
  }
}
