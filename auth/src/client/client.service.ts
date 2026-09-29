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
import { Role } from 'src/admin/entities/user.entity';
import { ClientAuthAudit } from './entities/auth-audit.entity';

@Injectable()
export class ClientService {
  private readonly salt = 10;
  private readonly logger = new Logger(ClientService.name);

  constructor(
    @InjectRepository(clientUser)
    private user: MongoRepository<clientUser>,
    @InjectRepository(ClientAuthAudit)
    private AuthAudit: MongoRepository<ClientAuthAudit>,
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

  async signin(
    SigninAuthDto: SigninAuthDto,
    ipAddress: string,
    userAgent: string,
  ) {
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
      await this.AuthAudit.save({
        attemptedIdentifier: SigninAuthDto.userCre,
        action: 'LOGIN FAILED',
        reason: 'INVALID_CREDENTIALS',
        ipAddress: ipAddress,
        userAgent: userAgent,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      SigninAuthDto.password,
      isExist?.password,
    );

    if (!isPasswordValid) {
      await this.AuthAudit.save({
        attemptedIdentifier: SigninAuthDto.userCre,
        action: 'LOGIN FAILED',
        reason: 'INVALID_PASSWORD',
        ipAddress: ipAddress,
        userAgent: userAgent,
      });
      throw new BadRequestException('invalid password');
    }

    await this.AuthAudit.save({
      userId: isExist?._id?.toString(),
      attemptedIdentifier: SigninAuthDto.userCre,
      action: 'LOGIN SUCCESSFULL',
      ipAddress: ipAddress,
      userAgent: userAgent,
    });

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
