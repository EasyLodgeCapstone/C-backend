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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ClientAuthGuard } from '../client-auth/client-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(ClientAuthGuard)
  @Post()
  create(
    @Req() req: Request & { user: { sub: string } },
    @Body() createCartDto: CreateCartDto,
  ) {
    const userId = req.user.sub;
    return this.cartService.create(userId, createCartDto);
  }

  @UseGuards(ClientAuthGuard)
  @Get('fetchCart')
  findAll(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.cartService.findAll(userId);
  }

  @Get('getSingleCart')
  findOne(@Query('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch('updateQuantity')
  update(@Query('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete('deleteCart')
  remove(@Query('id') id: string) {
    return this.cartService.remove(id);
  }
}
