import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('productCreate')
  async create(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true, // Strips properties not in DTO
        forbidNonWhitelisted: true, // Throws error if extra properties
      }),
    )
    createProductDto: CreateProductDto,
  ) {
    const productData = {
      ...createProductDto,
    };

    return this.productsService.create(productData);
  }

  @Get('getProducts')
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.productsService.findAll(page, limit);
  }

  @Get('getSingleProduct')
  findOne(@Query('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch('updateProduct')
  update(@Query('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('deleteProduct')
  remove(@Query('id') id: string) {
    return this.productsService.remove(id);
  }
}
