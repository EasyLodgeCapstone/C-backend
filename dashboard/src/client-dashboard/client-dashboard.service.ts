import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from './product-entity/product.entity';
import { Account } from './account-entity/account.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class ClientDashboardService {
  constructor(
    @InjectRepository(Product)
    private product: MongoRepository<Product>,
    @InjectRepository(Account)
    private account: MongoRepository<Account>,
  ) {}

  async findSpecProduct(
    category: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const product = await this.product.find({
      where: { category: category },
      order: { productName: 'ASC' },
      skip: skip,
      take: limit,
    });

    const [, total] = await this.product.findAndCount({
      where: { category: category },
    });

    return {
      product,
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

  async getAccount() {
    const accounts = await this.account.find();

    return {
      accounts,
    };
  }

  async findOne(productId: string) {
    if (!ObjectId.isValid(productId)) {
      throw new BadRequestException();
    }
    const product = await this.product.findOne({
      where: { _id: new ObjectId(productId) },
    });

    return {
      product,
    };
  }
}
