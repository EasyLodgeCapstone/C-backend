import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ClientAuthGuard } from '../client-auth/client-auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(@Inject('CART_SERVICE') private cartService: ClientProxy) {}

  @UseGuards(ClientAuthGuard)
  @Post('create-cart')
  create(
    @Req() req: Request & { user: { sub: string } },
    @Body() CartDto: CartDto,
  ) {
    const userId = req.user.sub;
    const cart = {
      userId,
      productId: CartDto.productId,
      quantity: CartDto.quantity,
    };
    return this.cartService.send({ cmd: 'add_cart' }, { cart });
  }

  @UseGuards(ClientAuthGuard)
  @Get('fetchCart')
  findAll(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.cartService.send({ cmd: 'fetch_cart' }, userId);
  }

  @UseGuards(ClientAuthGuard)
  @Get('getSingleCart')
  findOne(
    @Req() req: Request & { user: { sub: string } },
    @Query('id') id: string,
  ) {
    const userId = req.user.sub;
    const ids = {
      id,
      userId,
    };
    return this.cartService.send({ cmd: 'get_single_cart' }, ids);
  }

  @UseGuards(ClientAuthGuard)
  @Patch('updateQuantity')
  update(
    @Req() req: Request & { user: { sub: string } },
    @Body() CartDto: CartDto,
  ) {
    const userId = req.user.sub;
    const update = {
      userId,
      productId: CartDto.productId,
      quantity: CartDto.quantity,
    };
    return this.cartService.send({ cmd: 'update_quantity' }, update);
  }

  @Delete('deleteCart')
  remove(@Query('id') id: string) {
    return this.cartService.send({ cmd: 'delete_cart' }, id);
  }
}
