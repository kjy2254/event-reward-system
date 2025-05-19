import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const createdUser = new this.userModel({
      email: dto.email,
      password: hashed,
      role: dto.role,
    });

    return createdUser.save();
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; expiresAt: number }> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
    const expiresAt = decoded.exp ? decoded.exp * 1000 : null; // JS timestamp (ms)

    return { accessToken, expiresAt };
  }
}
