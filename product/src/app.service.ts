import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MongoRepository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ObjectId } from 'mongodb';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Product)
    private product: MongoRepository<Product>,
  ) {}
  async create(productData: CreateProductDto) {
    const isProductExist = await this.product.find({
      where: { productName: productData.productName },
    });

    if (isProductExist.length > 0) {
      throw new ConflictException('Product already exists in database');
    }

    const newProduct = this.product.create({
      ...productData,
    });

    const result = await this.product.save(newProduct);

    return result;
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const products = await this.product.find({
      skip: skip,
      take: limit,
    });

    const [, total] = await this.product.findAndCount();

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const product = await this.product.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const product = await this.product.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updatedProduct = this.product.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateProductDto } },
      { returnDocument: 'after' },
    );

    return updatedProduct;
  }

  async remove(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.product.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!product) {
      throw new BadRequestException(`no product with this id ${id}`);
    }

    return {
      message: 'product deleted',
      product,
    };
  }
}
