import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { AuthDto } from './dto/';
import * as bcrypt from 'bcryptjs';
import { Tokens } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private JWTService: JwtService,
  ) {}

  async signInLocal(authDto: AuthDto): Promise<Tokens> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: authDto.email },
      });
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      const passwordMatches = await bcrypt.compare(
        authDto.password,
        user.hashedRT,
      );
      if (!passwordMatches) {
        throw new HttpException(
          'Указан неверный пароль',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRTHash(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new HttpException(
        'Ошибка при входе',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async signUpLocal(authDto: AuthDto): Promise<Tokens> {
    try {
      const hash = await this.hashData(authDto.password);
      const newUser = await this.userRepository.create({
        email: authDto.email,
        password: hash,
      });
      if (!newUser) {
        throw new HttpException(
          'Не удалось создать пользователя',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const tokens = await this.getTokens(newUser.id, newUser.email);
      await this.updateRTHash(newUser.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new HttpException(
        'Ошибка при регистрации',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async logout(userId: string) {
    try {
      const user = await this.userRepository.findByPk(userId);
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      await user.update({ hashedRT: null });
      return { message: 'Выход из системы совершён успешно' };
    } catch (error) {
      throw new HttpException(
        'Ошибка при выходе из системы',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async refreshTokens(userId: string, rt: string) {
    try {
      const user = await this.userRepository.findByPk(userId);
      if (!user || !user.hashedRT) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      const rtMatches = bcrypt.compare(rt, user.hashedRT);
      if (!rtMatches) {
        throw new HttpException('Указан неверный Refresh Token', 401);
      }
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRTHash(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {}
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async updateRTHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    const user = await this.userRepository.findByPk(userId);
    await user.update({ hashedRT: hash });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.JWTService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: '15m',
          secret: process.env.JWT_ACCESS_KEY,
        },
      ),
      this.JWTService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_KEY,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
