import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('account')
export class AccountController {
  constructor(@Inject('ACCOUNT_SERVICE') private accountService: ClientProxy) {}

  @Post('createAccount')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.send(
      { cmd: 'account_create_account' },
      createAccountDto,
    );
  }

  @Get('fetchAccounts')
  findAll() {
    return this.accountService.send({ cmd: 'account_fetch_account' }, '1');
  }

  @Get('fetchSingleAccount')
  findOne(@Query('id') id: string) {
    return this.accountService.send({ cmd: 'account_fetch_one' }, id);
  }

  @Patch('updateAccount')
  update(@Query('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    const update = {
      id,
      updateAccountDto,
    };
    return this.accountService.send({ cmd: 'account_update_account' }, update);
  }

  @Delete('deleteAccount')
  remove(@Query('id') id: string) {
    return this.accountService.send({ cmd: 'account_delete' }, id);
  }
}
