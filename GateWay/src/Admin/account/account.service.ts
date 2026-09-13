import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private Account: MongoRepository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const account = this.Account.create({
      ...createAccountDto,
    });

    const result = await this.Account.save(account);

    if (!result) {
      throw new BadGatewayException('failed to create Account number');
    }
    return result;
  }

  async findAll() {
    const result = await this.Account.find();

    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async findOne(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('invalid id');
    }

    const result = await this.Account.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!result) {
      throw new NotFoundException('account number not found');
    }
    return result;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('invalid id');
    }

    const updatedAccount = await this.Account.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateAccountDto } },
      { returnDocument: 'after' },
    );

    if (!updatedAccount) {
      throw new BadGatewayException('failed to update account');
    }

    return updatedAccount;
  }

  async remove(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('invalid id');
    }

    const deleteAccount = await this.Account.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deleteAccount) {
      throw new BadRequestException(`no Account with this id ${id}`);
    }

    return {
      message: 'Account deleted',
      deleteAccount,
    };
  }
}
