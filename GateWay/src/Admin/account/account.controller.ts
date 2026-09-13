import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('createAccount')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get('fetchAccounts')
  findAll() {
    return this.accountService.findAll();
  }

  @Get('fetchSingleAccount')
  findOne(@Query('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Patch('updateAccount')
  update(@Query('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete('deleteAccount')
  remove(@Query('id') id: string) {
    return this.accountService.remove(id);
  }
}
