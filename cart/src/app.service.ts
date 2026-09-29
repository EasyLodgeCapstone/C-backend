import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Cart } from './cart-entities/cart.entity';
import { Product } from './product-entities/product.entity';
import { ObjectId } from 'mongodb';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Cart)
    private cart: MongoRepository<Cart>,
    @InjectRepository(Product)
    private product: MongoRepository<Product>,
  ) {}

  async onModuleInit() {
    try {
      await this.cart.manager.createCollectionIndex(
        Cart,
        { userId: 1, productId: 1 },
        { unique: true },
      );
    } catch (err) {
      // 85 = IndexOptionsConflict, 86 = IndexKeySpecsConflict → already exists
      if (![85, 86].includes(err?.code)) throw err;
    }
  }

  async create(userId: string, productId: string, quantity: number) {
    if (!ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    if (!ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product id');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const userid = new ObjectId(userId);
    const productid = new ObjectId(productId);

    const product = await this.product.findOne({ where: { _id: productid } });
    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    const existing = await this.cart.findOne({
      where: { userId: userid, productId: productid },
    });

    if (existing) {
      const quantityUpdate = existing.productQuantity + quantity;
      await this.cart.findOneAndUpdate(
        { userId: userid, productId: productid },
        { $set: { productQuantity: quantityUpdate } },
      );
      return { message: 'cart updated' };
    }

    await this.cart.save(
      this.cart.create({
        userId: userid,
        productId: productid,
        productQuantity: quantity,
      }),
    );
    return { message: 'cart created' };
  }

  async findAll(userId: string) {
    if (!ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    const carts = await this.cart.find({
      where: { userId: new ObjectId(userId) },
      order: { createdAt: 'ASC' },
    });

    if (carts.length === 0) return [];

    const productsIds = carts.map((c) => c.productId);
    const products = await this.product.find({
      where: { _id: { $in: productsIds } },
    });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    const cart = carts.map((cart) => {
      const product = productMap.get(cart.productId.toString());

      let subTotal = 0;

      if (product) {
        const price =
          typeof product.discountPrice === 'number' && product.discountPrice > 0
            ? product.discountPrice
            : product.productPrice;

        subTotal = price * cart.productQuantity;
      }

      return {
        _id: cart._id,
        productId: cart.productId,
        productQuantity: cart.productQuantity,
        subTotal: subTotal.toFixed(2),
        product: product ?? null,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      };
    });

    const totalPrice = cart.reduce(
      (sum, item) => sum + Number(item.subTotal),
      0,
    );

    return {
      cart,
      totalPrice: totalPrice.toFixed(2),
    };
  }

  async findOne(id: string, userId: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    if (!ObjectId.isValid(userId)) {
      throw new BadRequestException('please login or sign up');
    }

    const cart = await this.cart.findOne({
      where: {
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      },
    });

    if (!cart) throw new NotFoundException(`Cart item ${id} not found`);

    const product = await this.product.findOne({
      where: { _id: cart.productId },
    });

    if (!product) {
      throw new NotFoundException('Product no longer available');
    }

    const subTotal = product
      ? product.discountPrice !== undefined && product.discountPrice > 0
        ? product.discountPrice * cart.productQuantity
        : product.productPrice * cart.productQuantity
      : 0;

    return {
      product,
      productQuantity: cart.productQuantity,
      subTotal,
    };
  }

  async setQuantity(userId: string, productId: string, quantity: number) {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid id');
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const userOid = new ObjectId(userId);
    const productOid = new ObjectId(productId);

    const product = await this.product.findOne({ where: { _id: productOid } });
    if (!product) throw new NotFoundException('Product not found');
    if (quantity > product.stockQuantity) {
      throw new BadRequestException('Not enough stock');
    }

    const result = await this.cart.updateOne(
      { userId: userOid, productId: productOid },
      { $set: { productQuantity: quantity, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Cart item not found');
    }

    return { message: 'quantity updated' };
  }

  async delete(id: string) {
    if (!ObjectId.isValid(id)) throw new BadRequestException('invalid id');

    const result = await this.cart.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return { message: 'cart deleted', result };
  }
}
