import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { signupDto } from './Dto/signupDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { signinDto } from './Dto/signinDto';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(User)
    private user: MongoRepository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: signupDto) {
    const isEmailExist = await this.user.find({
      where: { email: signupDto.email },
    });

    if (isEmailExist.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    const isNameExist = await this.user.find({
      where: { name: signupDto.name },
    });
    if (isNameExist.length > 0) {
      throw new ConflictException('User with this name already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const newUser = this.user.create({
      name: signupDto.name,
      email: signupDto.email,
      role: Role.Admin as User['role'],
      password: hashedPassword,
    });

    const result = await this.user.save(newUser);

    const userId = result._id.toString();

    const payload = { sub: userId, username: result.name, role: result.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async signin(signinDto: signinDto) {
    const isExist = await this.user.findOne({
      where: {
        $or: [{ name: signinDto.userCre }, { email: signinDto.userCre }],
      },
    });

    if (!isExist) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(signinDto.password, isExist?.password);
    // console.log(await bcrypt.hash('Nelliz170359$', 10));

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = isExist._id.toString();

    const payload = { sub: userId, username: isExist.name, role: isExist.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async verify(userId: string) {
    const isVerify = await this.user.findOne({
      where: { _id: new ObjectId(userId) },
    });

    if (!isVerify) {
      throw new UnauthorizedException();
    }

    const { _id, name, email, role } = isVerify;
    const isSafe = { _id, name, email, role };

    return isSafe;
  }
}
