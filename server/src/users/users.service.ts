import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(createUserDto);
      if (!user) {
        throw new HttpException(
          'Не удалось создать пользователя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Не удалось создать пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(limit: number, offset: number) {
    try {
      const { count, rows } = await this.userRepository.findAndCountAll({
        limit: limit,
        offset: offset,
        include: { all: true },
      });
      if (!rows) {
        throw new HttpException(
          `Не удалось получить пользователей`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { count, rows };
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new HttpException(
          `Не удалось получить пользователя`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new HttpException(
          `Пользователь c id: ${id} не найден`,
          HttpStatus.NOT_FOUND,
        );
      }
      await user.update(updateUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        'Ошибка при изменении пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new HttpException(
          `Пользователь c id: ${id} не найден`,
          HttpStatus.NOT_FOUND,
        );
      }
      await user.destroy();
      return { message: `Пользователь с id: ${id} удален` };
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }
}
