import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Inject,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject('PRODUCT_SERVICE') private productClient: ClientProxy) {}

  @Post('productCreate')
  create(
    @Body(new ValidationPipe())
    createProductDto: CreateProductDto,
  ) {
    return this.productClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get('getProducts')
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const pag = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    console.log(pag);

    return this.productClient.send({ cmd: 'get_products' }, pag);
  }

  @Get('getSingleProduct')
  findOne(@Query('id') id: string) {
    return this.productClient.send({ cmd: 'get_single_product' }, id);
  }

  @Patch('updateProduct')
  update(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const update = {
      id,
      updateProductDto,
    };
    return this.productClient.send({ cmd: 'update_product' }, update);
  }

  @Delete('deleteProduct')
  remove(@Query('id') id: string) {
    return this.productClient.send({ cmd: 'delete_product' }, id);
  }
}
