import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { AuthDto } from './dto/';
import * as bcrypt from 'bcrypt';
import { Tokens } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ValidationError } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private userService: UsersService,
    private JWTService: JwtService,
  ) {}

  async signUpLocal(authDto: AuthDto): Promise<Tokens | HttpException> {
    try {
      const candidate = await this.userService.getByEmail(authDto.email);
      if (candidate) {
        return new HttpException(
          'Пользователь с таким email уже существует',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = await this.hashData(authDto.password);
      const newUser = await this.userService.create({
        ...authDto,
        password: hashedPassword,
      });
      if (!newUser) {
        return new HttpException(
          'Не удалось создать пользователя, ошибка БД',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (newUser instanceof User) {
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRTHash(newUser.id, tokens.refreshToken);
        return tokens;
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return new HttpException(
          'Sequelize ValidationError',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        return new HttpException(
          'SequelizeUniqueConstraintError',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      } else {
        return new HttpException(
          'Ошибка при регистрации',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }
  }

  async signInLocal(authDto: AuthDto): Promise<Tokens | HttpException> {
    try {
      const user = await this.userService.getByEmail(authDto.email);
      if (!user) {
        return new HttpException(
          'Пользователь не найден',
          HttpStatus.NOT_FOUND,
        );
      }
      const passwordMatches = await bcrypt.compare(
        authDto.password,
        user.password,
      );

      if (!passwordMatches) {
        return new HttpException(
          'Указан неверный пароль',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRTHash(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error instanceof ValidationError) {
        return new HttpException(
          'Sequelize ValidationError',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        return new HttpException(
          'SequelizeUniqueConstraintError',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      } else {
        return new HttpException(
          'Ошибка при входе',
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }
  }

  async logout(userId: string): Promise<{ message: string } | HttpException> {
    try {
      const user = await this.userRepository.findByPk(userId);
      if (!user) {
        return new HttpException(
          'Пользователь не найден',
          HttpStatus.NOT_FOUND,
        );
      }
      await user.update({ hashedRT: null });
      return { message: 'Выход из системы совершён успешно' };
    } catch (error) {
      return new HttpException(
        'Ошибка при выходе из системы',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async refreshTokens(
    userId: string,
    rt: string,
  ): Promise<Tokens | HttpException> {
    try {
      const user = await this.userRepository.findByPk(userId);
      if (!user || !user.hashedRT) {
        return new HttpException(
          'Пользователь не найден',
          HttpStatus.NOT_FOUND,
        );
      }
      const rtMatches = bcrypt.compare(rt, user.hashedRT);
      if (!rtMatches) {
        return new HttpException('Указан неверный Refresh Token', 401);
      }
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRTHash(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      return new HttpException(
        'Указан неверный Refresh Token',
        HttpStatus.UNAUTHORIZED,
        { cause: error },
      );
    }
  }

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async updateRTHash(userId: string, rt: string): Promise<void> {
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
