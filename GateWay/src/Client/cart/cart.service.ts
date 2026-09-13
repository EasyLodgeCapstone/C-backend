import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cart: MongoRepository<Cart>,
  ) {}

  async create(id: string, createCartDto: CreateCartDto) {
    if (ObjectId.isValid(id)) {
      throw new BadRequestException('please register or login');
    }
    const userId = new ObjectId(id);
    const productId = new ObjectId(createCartDto.productId);
    const carts = await this.cart.find({
      where: {
        $or: [{ userId: userId }, { productName: createCartDto.productName }],
      },
    });

    if (carts.length > 0) {
      // Check if product already exists in cart
      const existingCart = carts.find(
        (cart) =>
          cart.userId === userId &&
          cart.productName === createCartDto.productName,
      );

      if (existingCart) {
        //  Update existing cart item
        existingCart.productQuantity += 1;
        existingCart.subTotal =
          existingCart.productPrice * existingCart.productQuantity;

        //  SAVE the updated cart
        await this.cart.save(existingCart);

        return {
          message: 'Product quantity updated',
          cart: existingCart,
        };
      } else {
        //  Create new cart item
        const newCart = this.cart.create({
          ...createCartDto,
          userId: userId,
          productId: productId,
          productQuantity: 1,
          productPrice: createCartDto.productPrice,
        });

        await this.cart.save(newCart);

        return {
          message: 'Product added to cart',
          cart: newCart,
        };
      }
    } else {
      //  Create new cart item
      const newCart = this.cart.create({
        ...createCartDto,
        userId: userId,
        productId: productId,
        productQuantity: 1,
        productPrice: createCartDto.productPrice,
      });

      await this.cart.save(newCart);

      return {
        message: 'Product added to cart',
        cart: newCart,
      };
    }
  }

  async findAll(userId: string) {
    if (ObjectId.isValid(userId)) {
      throw new BadRequestException('invalid id');
    }

    const findProduct = await this.cart.find({
      userId: new ObjectId(userId),
      order: { createdAt: 'ASC' },
    });

    if (findProduct.length > 0) {
      for (const cart of findProduct) {
        cart.subTotal = cart.productQuantity * cart.productPrice;
        cart.updatedAt = new Date();

        await this.cart.save(cart); // Save each one
      }
    }
    return {
      data: findProduct,
    };
  }

  async findOne(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const cart = await this.cart.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!cart) {
      throw new NotFoundException();
    }

    const subCartTotal = await this.cart.find({
      where: { productId: cart.productId },
    });

    let perPrice: number | undefined;

    if (subCartTotal.length > 0) {
      for (const cart of subCartTotal) {
        const total: number =
          Number(cart.productQuantity) * Number(cart.productPrice);
        cart.perTotal = total;
        perPrice = total;
        cart.updatedAt = new Date();

        await this.cart.save(cart); // Save each one
      }
    }

    return {
      cart: cart,
      perTotal: perPrice,
    };
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    if (ObjectId.isValid(id)) {
      throw new BadRequestException('invalid id');
    }

    await this.cart.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateCartDto } },
      { returnDocument: 'after' },
    );

    return {
      message: 'item updated successfully',
    };
  }

  async remove(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const cart = await this.cart.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!cart) {
      throw new BadRequestException(`no cart with this id ${id}`);
    }

    return {
      message: 'cart deleted',
      cart,
    };
  }
}
