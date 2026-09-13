import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { clientUser } from './entities/auth.entity';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { SigninAuthDto } from './dto/signin.auth';
import { Role } from 'src/Admin/admin-auth/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly salt = 10;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(clientUser)
    private user: MongoRepository<clientUser>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const existingUser = await this.user.findOne({
        where: {
          $or: [
            { email: createAuthDto.email },
            { userName: createAuthDto.userName },
          ],
        },
      });

      if (existingUser) {
        const field =
          existingUser.email === createAuthDto.email ? 'Email' : 'Username';
        throw new ConflictException(`${field} already exists`);
      }

      const hashPassword = await bcrypt.hash(createAuthDto.password, this.salt);

      const user = this.user.create({
        ...createAuthDto,
        password: hashPassword,
        role: Role.User,
      });

      const result = await this.user.save(user);

      const token = await this.generateToken(result);

      return {
        token: token,
      };
    } catch (error: unknown) {
      const isMongoDuplicateError = (
        value: unknown,
      ): value is { code?: number } =>
        typeof value === 'object' &&
        value !== null &&
        'code' in value &&
        typeof value.code === 'number';

      const errorCode = isMongoDuplicateError(error) ? error.code : undefined;

      if (errorCode === 11000) {
        throw new ConflictException('Email  or userName already exists');
      }
      throw error;
    }
  }

  async signin(SigninAuthDto: SigninAuthDto) {
    const isExist = await this.user.findOne({
      where: {
        $or: [
          { userName: SigninAuthDto.userCre },
          { email: SigninAuthDto.userCre },
        ],
      },
    });

    if (!isExist) {
      this.logger.warn(
        `Login attempt with non-existent user: ${SigninAuthDto.userCre}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      SigninAuthDto.password,
      isExist?.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('invalid password');
    }

    const token = await this.generateToken(isExist);

    return {
      token: token,
    };
  }

  async verify(userId: string) {
    const isVerify = await this.user.findOne({
      where: { _id: new ObjectId(userId) },
    });

    if (!isVerify) {
      throw new UnauthorizedException();
    }

    const isSafe: {
      _id: ObjectId;
      userName: string;
      email: string;
      role: Role;
    } = {
      _id: isVerify._id,
      userName: isVerify.userName,
      email: isVerify.email,
      role: isVerify.role,
    };

    return isSafe;
  }

  private async generateToken(user: clientUser): Promise<string> {
    return await this.jwtService.signAsync({
      sub: user._id.toString(),
      userName: user.userName,
      email: user.email,
      role: user.role,
    });
  }
}
